// importing cli functions
import { add, del, done, help, ls, report } from "./utils.js";

// getting all the args from terminal
const args = process.argv;

// taking args only we interested in it
let commands = args.slice(2);

// switch case for getting which case user wants to run
switch (commands[0]) {
  case undefined:
    help();
    break;

  case "help":
    help();
    break;

  case "add":
    if (!commands[2]) {
      console.log(" Error: Missing tasks string. Nothing added!");
    } else {
      add(commands[1], commands[2]);
    }
    break;

  case "ls":
    ls();
    break;

  case "del":
    if (commands[1]) {
      del(commands[1]);
    }
    else{
      console.log("Error: Missing NUMBER for deleting tasks.");
    }
    break;

  case "report":
    report();
    break;

  case "done":
    if (commands[1]) {
      done(commands[1]);
    }
    else{
      console.log("Error: Missing NUMBER for marking tasks as done.");
    }
    break;

  default:
    break;
}

// End of the todo cli