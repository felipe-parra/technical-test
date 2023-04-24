import { ITask } from "@/interfaces/task.interface";
import { baseAxios } from "@/utils/axios";

/**
 * Get all tasks
 * @returns Promise<{error: string, data: ITask[]}>
 */
export const getAlltask = async () => {
  let error,
    data: ITask[] = [];
  try {
    const res = await baseAxios({
      url: "/tasks",
      method: "GET",
    });
    data = res.data.results;
    console.log({ data });
  } catch (err) {
    error = "Something went wrong";
    console.error("Error getting all tasks", { error });
  } finally {
    return {
      error,
      data,
    };
  }
};
/**
 * Create a task
 * @param task task object
 * @returns Promise<{error: string, data: ITask}>
 */
export const createTask = async (task: ITask) => {
  let error, data;
  try {
    const res = await baseAxios({
      url: "/tasks",
      method: "POST",
      data: task,
    });
    data = res.data;
  } catch (err) {
    console.error("Error creating task", { err });
    error = "Something went wrong";
  } finally {
    return {
      error,
    };
  }
};
/**
 * Get a task by id
 * @param id number
 * @returns Promise<{error: string, data: ITask}>
 */
export const getTaskById = async (id: number) => {
  let error, data: ITask | undefined;
  try {
    const res = await baseAxios({
      url: `/tasks/${id}`,
      method: "GET",
    });

    data = res.data.results;
  } catch (err) {
    console.error("Error getting task", { err });
    error = "Something went wrong";
  } finally {
    return {
      error,
      data,
    };
  }
};

export const updateTask = async (task: ITask) => {
  let error, data;
  try {
    const { data } = await baseAxios({
      url: `/tasks/${task.id}`,
      method: "PUT",
      data: task,
    });
    return data;
  } catch (err) {
    console.error("Error updating task", { err });
    error = "Something went wrong";
  } finally {
    return {
      error,
      data,
    };
  }
};

export const deleteTask = async (id: number) => {
  try {
    const { data } = await baseAxios({
      url: `/tasks/${id}`,
      method: "DELETE",
    });
    return data;
  } catch (error) {
    return {
      error: {
        message: "Something went wrong",
      },
    };
  }
};
