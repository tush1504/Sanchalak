const Task = require('../models/Task');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const sendMail = require("../utils/sendMail");
const logActivity = require("../utils/logActivity");

const { BadRequestError, NotFoundError, UnauthenticatedError} = require('../errors');


const createTask = asyncHandler(async (req, res) => {
  const { title, description, deadline, priority, assignedTo } = req.body;

  if (!title || !description || !deadline  || !assignedTo) {
    throw new BadRequestError('All task fields are required');
  }

  const assignee = await User.findById(assignedTo);
  if (!assignee) {
    throw new BadRequestError('Assigned user must be a valid team member');
  }

  const task = await Task.create({
    title,
    description,
    deadline,
    priority,
    assignedTo,
    createdBy: req.user._id,
  });

  await sendMail({
    to: assignee.email,
    subject: 'New Task Assigned',
    html: `
      <h3>Hello ${assignee.name},</h3>
      <p>You have been assigned a new task by your team leader <strong>${req.user.name}</strong>.</p>
      <h4>Task Details:</h4>
      <ul>
        <li><strong>Title:</strong> ${title}</li>
        <li><strong>Description:</strong> ${description}</li>
        <li><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</li>
        <li><strong>Priority:</strong> ${task.priority}</li>
      </ul>
      <p>Please log in to your dashboard to view and manage this task.</p>
    `,
  });

  await logActivity({
    userId: req.user._id,
    role: "Leader",
    action: "Created a new task",
    target: `Task ${task.title} -> ${assignee.name}`,
  });

  res.status(201).json({ success: true, data: task });
});



const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  await task.deleteOne();

  await logActivity({
    userId: req.user._id,
    role: "Leader",
    action: "Deleted a task",
    target: `Task ${task.title}`,
  });

  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});


const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().populate('assignedTo', 'name email');

  const formattedTasks = tasks.map(task => ({
    id: task._id,
    title: task.title,
    due: task.deadline,
    priority: task.priority,
    status:task.status,
    assignedTo: task.assignedTo.name,
    assignee_email: task.assignedTo.email
  }));

  res.status(200).json(formattedTasks);
});



const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id });

  res.status(200).json({ success: true, data: tasks });
});


const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new BadRequestError('Status field is required');
  }
  
  const task = await Task.findById(req.params.id).populate('createdBy', 'name email');
  
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  if (task.assignedTo.toString() !== req.user._id.toString()) {
    throw new UnauthenticatedError('Not authorized to update this task');
  }

  task.status = status;
  await task.save();

  await logActivity({
    userId: req.user._id,
    role: "Member",
    action: "Updated a task",
    target: `Task "${task.title}" status → ${status}`,
  });

  if (status.toLowerCase() === 'completed') {
    await sendMail({
      to: task.createdBy.email,
      subject: `Task Completed: ${task.title}`,
      html: `
        <h3>Hello ${task.createdBy.name},</h3>
        <p>Your team member <strong>${req.user.name}</strong> has marked the task <strong>${task.title}</strong> as <span style="color:green;"><strong>Completed</strong></span>.</p>
        <h4>Task Summary:</h4>
        <ul>
          <li><strong>Title:</strong> ${task.title}</li>
          <li><strong>Description:</strong> ${task.description}</li>
          <li><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleDateString()}</li>
        </ul>
        <p><a href="https://sanchalak.vercel.app/login" target="_blank">Login</a> to the dashboard to review the task.</p>
      `,
    });
  }
  
  res.status(200).json({ success: true, data: task });
});


module.exports = {createTask, deleteTask, getAllTasks, getMyTasks, updateTaskStatus};