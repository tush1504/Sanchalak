// controllers/dashboardController.js
const User = require('../models/User');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog'); // Add this import

// Leader Dashboard Analytics
const getLeaderDashboard = async (req, res) => {
  try {
    const leaderId = req.user.id; // From auth middleware
    
    // Get all team members under this leader
    const teamMembers = await User.find({ 
      teamLeader: leaderId,
      role: 'member' 
    }).select('name email createdAt');
    
    // Get all tasks created by this leader
    const allTasks = await Task.find({ createdBy: leaderId });
    
    // Calculate task statistics
    const taskStats = {
      total: allTasks.length,
      pending: allTasks.filter(task => task.status === 'Pending').length,
      inProgress: allTasks.filter(task => task.status === 'In-Progress').length,
      completed: allTasks.filter(task => task.status === 'Completed').length,
    };
    
    // Calculate active tasks (pending + in-progress)
    const activeTasks = taskStats.pending + taskStats.inProgress;
    
    // Get recent activities from ActivityLog (last 10 activities related to this leader's team)
    const teamMemberIds = teamMembers.map(member => member._id);
    const recentActivities = await ActivityLog.find({
      $or: [
        { user: leaderId }, // Activities by the leader
        { user: { $in: teamMemberIds } } // Activities by team members
      ]
    })
      .populate('user', 'name email role')
      .sort({ timestamp: -1 })
      .limit(10);
    
    // Format recent activities for frontend
    const formattedActivities = recentActivities.map(activity => ({
      id: activity._id,
      type: activity.action.toLowerCase().includes('completed') ? 'task_completed' : 
            activity.action.toLowerCase().includes('created') ? 'task_created' :
            activity.action.toLowerCase().includes('member') ? 'member_added' : 'activity',
      user: activity.user.name,
      action: activity.action,
      target: activity.target,
      time: activity.timestamp,
      userRole: activity.user.role
    }));
    
    // Get team performance metrics
    const completionRate = taskStats.total > 0 
      ? Math.round((taskStats.completed / taskStats.total) * 100) 
      : 0;
    
    // Calculate average task completion time (for completed tasks in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCompletedTasks = await Task.find({
      createdBy: leaderId,
      status: 'Completed',
      updatedAt: { $gte: thirtyDaysAgo }
    });
    
    let avgCompletionDays = 0;
    if (recentCompletedTasks.length > 0) {
      const totalDays = recentCompletedTasks.reduce((sum, task) => {
        const daysDiff = Math.ceil((task.updatedAt - task.createdAt) / (1000 * 60 * 60 * 24));
        return sum + daysDiff;
      }, 0);
      avgCompletionDays = Math.round((totalDays / recentCompletedTasks.length) * 10) / 10;
    }
    
    // Get overdue tasks
    const overdueTasks = await Task.find({
      createdBy: leaderId,
      deadline: { $lt: new Date() },
      status: { $ne: 'Completed' }
    }).countDocuments();
    
    // Calculate team engagement based on recent activity
    const recentActivityCount = await ActivityLog.countDocuments({
      user: { $in: [...teamMemberIds, leaderId] },
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });
    
    const teamEngagement = teamMembers.length > 0 
      ? Math.min(98, Math.round((recentActivityCount / (teamMembers.length + 1)) * 20)) // Rough calculation
      : 0;
    
    const dashboardData = {
      stats: {
        totalMembers: teamMembers.length,
        activeTasks: activeTasks,
        completedTasks: taskStats.completed,
        pendingTasks: taskStats.pending,
        inProgressTasks: taskStats.inProgress,
        overdueTasks: overdueTasks
      },
      teamMembers: teamMembers,
      recentActivities: formattedActivities,
      performance: {
        completionRate: completionRate,
        avgCompletionDays: avgCompletionDays,
        teamEngagement: teamEngagement
      },
      taskBreakdown: {
        byStatus: {
          pending: taskStats.pending,
          inProgress: taskStats.inProgress,
          completed: taskStats.completed
        },
        byPriority: {
          low: allTasks.filter(task => task.priority === 'Low').length,
          medium: allTasks.filter(task => task.priority === 'Medium').length,
          high: allTasks.filter(task => task.priority === 'High').length
        }
      }
    };
    
    res.status(200).json({
      success: dashboardData,
      data: null
    });
    
  } catch (error) {
    console.error('Leader dashboard error:', error);
    res.status(500).json({
      success: null,
      data: {
        message: 'Failed to fetch dashboard data',
        error: error.message
      }
    });
  }
};

// Member Dashboard Analytics
const getMemberDashboard = async (req, res) => {
  try {
    const memberId = req.user.id; // From auth middleware
    
    // Get all tasks assigned to this member
    const myTasks = await Task.find({ assignedTo: memberId })
      .populate('createdBy', 'name email')
      .sort({ deadline: 1 });
    
    // Calculate task statistics
    const taskStats = {
      total: myTasks.length,
      pending: myTasks.filter(task => task.status === 'Pending').length,
      inProgress: myTasks.filter(task => task.status === 'In-Progress').length,
      completed: myTasks.filter(task => task.status === 'Completed').length,
    };
    
    // Get overdue tasks
    const overdueTasks = myTasks.filter(task => 
      task.deadline < new Date() && task.status !== 'Completed'
    );
    
    // Get upcoming tasks (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingTasks = myTasks
      .filter(task => 
        task.deadline <= nextWeek && 
        task.deadline >= new Date() && 
        task.status !== 'Completed'
      )
      .map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
        createdBy: task.createdBy.name,
        daysUntilDeadline: Math.ceil((task.deadline - new Date()) / (1000 * 60 * 60 * 24))
      }));
    
    // Get recently completed tasks (from task data only)
    const recentCompletions = myTasks
      .filter(task => task.status === 'Completed')
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5)
      .map(task => ({
        task: task.title,
        completedAt: task.updatedAt,
        createdBy: task.createdBy.name
      }));
    
    // Create recent activities from task updates (member-accessible data only)
    const recentTaskActivities = myTasks
      .filter(task => task.updatedAt > task.createdAt) // Tasks that have been updated
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5)
      .map(task => ({
        id: task._id,
        action: `Updated "${task.title}" to ${task.status}`,
        target: task.title,
        time: task.updatedAt,
        status: task.status
      }));
    
    // Calculate weekly progress
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weeklyTasks = myTasks.filter(task => task.createdAt >= weekStart);
    const weeklyCompleted = weeklyTasks.filter(task => task.status === 'Completed');
    const weeklyProgress = weeklyTasks.length > 0 
      ? Math.round((weeklyCompleted.length / weeklyTasks.length) * 100) 
      : 0;
    
    // Calculate overall completion rate
    const completionRate = taskStats.total > 0 
      ? Math.round((taskStats.completed / taskStats.total) * 100) 
      : 0;
    
    // Calculate member performance metrics
    const onTimeCompletions = myTasks.filter(task => 
      task.status === 'Completed' && task.updatedAt <= task.deadline
    ).length;
    
    const onTimeRate = taskStats.completed > 0 
      ? Math.round((onTimeCompletions / taskStats.completed) * 100)
      : 0;
    
    const dashboardData = {
      stats: {
        assignedTasks: taskStats.total,
        pendingTasks: taskStats.pending,
        inProgressTasks: taskStats.inProgress,
        completedTasks: taskStats.completed,
        overdueTasks: overdueTasks.length
      },
      upcomingTasks: upcomingTasks,
      recentCompletions: recentCompletions,
      recentActivities: recentTaskActivities, // Based on task updates only
      progress: {
        weeklyProgress: weeklyProgress,
        weeklyCompleted: weeklyCompleted.length,
        weeklyTotal: weeklyTasks.length,
        overallCompletionRate: completionRate,
        onTimeCompletionRate: onTimeRate
      },
      taskBreakdown: {
        byStatus: {
          pending: taskStats.pending,
          inProgress: taskStats.inProgress,
          completed: taskStats.completed
        },
        byPriority: {
          low: myTasks.filter(task => task.priority === 'Low').length,
          medium: myTasks.filter(task => task.priority === 'Medium').length,
          high: myTasks.filter(task => task.priority === 'High').length
        }
      },
      overdueTasks: overdueTasks.map(task => ({
        id: task._id,
        title: task.title,
        deadline: task.deadline,
        priority: task.priority,
        daysOverdue: Math.ceil((new Date() - task.deadline) / (1000 * 60 * 60 * 24))
      }))
    };
    
    res.status(200).json({
      success: dashboardData,
      data: null
    });
    
  } catch (error) {
    console.error('Member dashboard error:', error);
    res.status(500).json({
      success: null,
      data: {
        message: 'Failed to fetch dashboard data',
        error: error.message
      }
    });
  }
};

module.exports = {
  getLeaderDashboard,
  getMemberDashboard
};