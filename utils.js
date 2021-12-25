// importing readFile and writeFile for communicate with task.txt file
import { readFile, writeFile } from "fs/promises";

// Default Usage
let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

// function for printing usage
export const help = async () => {
  console.log(usage);
};

// Reading data from task.txt (if not exist it will create one)
const readData = async () => {
  let data;
  try {
    data = await readFile(new URL("./task.txt", import.meta.url), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    data = [];
    await writeData(data);
    return data;
  }
};

// write data in task.txt
const writeData = async (data) => {
  await writeFile(new URL("./task.txt", import.meta.url), JSON.stringify(data));
};

// function for adding task into task.txt
export const add = async (priority, task) => {
  let tasks = await readData();
  tasks = [...tasks, { priority, task, isCompleted: false }];
  await writeData(tasks);
  console.log(`Added task: "${task}" with priority ${priority}`);
};

// function for list out all the task as per priority (in increasing order)
export const ls = async () => {
  const data = await readData();
  let pendingTasks = data.filter((value) => !value.isCompleted);
  if (pendingTasks.length == 0) {
    console.log(`There are no pending tasks!`);
  } else {
    pendingTasks.sort((a, b) => a.priority - b.priority);
    pendingTasks.map((value, index) => {
      console.log(`${index + 1}. ${value.task} [${value.priority}]`);
    });
  }
};

// function for deleting task from task.txt
export const del = async (index) => {
  let data = await readData();
  let pendingTasks = data.filter((value) => !value.isCompleted);
  let completedTasks = data.filter((value) => value.isCompleted);

  let newTasks;
  if (index > 0 && index <= pendingTasks.length) {
    newTasks = pendingTasks.filter((value, i) => i + 1 != index);
    await writeData([...newTasks, ...completedTasks]);
    console.log(`Deleted task #${index}`);
  } else {
    console.log(
      `Error: task with index #${index} does not exist. Nothing deleted.`
    );
  }
};

// Generating Reort
export const report = async () => {
  const data = await readData();
  const completedTasks = data.filter((task) => task.isCompleted);
  const pendingTasks = data.filter((task) => !task.isCompleted);

  console.log(`Pending : ${pendingTasks.length}`);
  pendingTasks.map((value, index) => {
    console.log(`${index + 1}. ${value.task} [${value.priority}]`);
  });

  console.log(`\nCompleted : ${completedTasks.length}`);
  completedTasks.map((value, index) => {
    console.log(`${index + 1}. ${value.task}`);
  });
};

// Mark task as done with given index from pendingTasks
export const done = async (index) => {
  let data = await readData();
  const completedTasks = data.filter((task) => task.isCompleted);
  const pendingTasks = data.filter((task) => !task.isCompleted);
  if (index > 0 && index <= pendingTasks.length) {
    pendingTasks.sort((a, b) => a.priority - b.priority);
    let finishedTask = pendingTasks.map((value, i) => {
      if (i + 1 == index) {
        value.isCompleted = true;
        return value;
      }
      return value;
    });
    await writeData([...completedTasks,...finishedTask]);
    console.log(`Marked item as done.`);
  } else {
    console.log(`Error: no incomplete item with index #${index} exists.`);
  }

};
