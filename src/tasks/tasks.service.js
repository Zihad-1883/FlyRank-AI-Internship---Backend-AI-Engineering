const seedTasks = [
  {
    id: 1,
    title: "Finish the project",
    done: false,
  },
  {
    id: 2,
    title: "Write documentation",
    done: false,
  },
  {
    id: 3,
    title: "Deploy to production",
    done: false,
  },
];

const getAllTasks = async () => {
  if (seedTasks.length === 0) {
    return {
      statusCode: 404,
      error: "No tasks found",
    };
  }
  return {
    statusCode: 200,
    data: seedTasks,
  };
};

const getSingleTask = async (id) => {
  const task = seedTasks.find((task) => task.id === parseInt(id));
  if (!task) {
    return {
      statusCode: 404,
      error: "Task not found",
    };
  } else {
    return {
      statusCode: 200,
      data: task,
    };
  }
};

module.exports = {
  getAllTasks,
  getSingleTask,
};
