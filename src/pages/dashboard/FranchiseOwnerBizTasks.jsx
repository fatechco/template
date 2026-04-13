import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TASK_COLUMNS = [
  { id: "todo", title: "📝 Todo" },
  { id: "inprogress", title: "🔄 In Progress" },
  { id: "review", title: "👁 Review" },
  { id: "done", title: "✅ Done" },
];

const INITIAL_TASKS = {
  todo: [
    { id: 1, title: "Update client proposal", description: "Revise pricing for Ahmed Hassan", priority: "high", assigned: "Sara", due: "2026-03-25", hours: 4 },
    { id: 2, title: "Follow up with leads", description: "Call 5 leads from this week", priority: "medium", assigned: "Omar", due: "2026-03-24", hours: 2 },
  ],
  inprogress: [
    { id: 3, title: "Prepare invoice batch", description: "Monthly invoices for March", priority: "medium", assigned: "Fatima", due: "2026-03-23", hours: 3 },
  ],
  review: [],
  done: [
    { id: 4, title: "Schedule team meeting", description: "Set up weekly sync", priority: "low", assigned: "Sara", due: "2026-03-20", hours: 1 },
  ],
};

function TaskCard({ task, onEdit }) {
  const priorityColor = task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟡" : "🟢";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-2 mb-2">
        <span className="text-lg">{priorityColor}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{task.title}</p>
          <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
        <span>👤 {task.assigned}</span>
        <span>⏱ {task.hours}h</span>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2">
        <div className="h-full w-1/3 bg-blue-500 rounded-full" />
      </div>

      <p className="text-xs text-gray-500 mb-2">📅 {task.due}</p>

      <div className="flex gap-1">
        <button onClick={() => onEdit(task)} className="flex-1 text-xs text-gray-600 hover:bg-gray-100 py-1 rounded">✏️ Edit</button>
        <button className="flex-1 text-xs text-red-600 hover:bg-red-50 py-1 rounded">🗑 Delete</button>
      </div>
    </div>
  );
}

export default function FranchiseOwnerBizTasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showAddTask, setShowAddTask] = useState(false);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const sourceTask = tasks[sourceColumn][source.index];

    const newTasks = {
      ...tasks,
      [sourceColumn]: tasks[sourceColumn].filter((_, i) => i !== source.index),
      [destColumn]: [...tasks[destColumn]],
    };

    newTasks[destColumn].splice(destination.index, 0, sourceTask);
    setTasks(newTasks);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-cyan-600 pl-4">
          <h1 className="text-3xl font-black text-gray-900">Tasks Management</h1>
        </div>
        <button onClick={() => setShowAddTask(true)} className="flex items-center gap-2 bg-cyan-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-cyan-700">
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {TASK_COLUMNS.map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-gray-50 rounded-xl p-4 min-h-[500px] flex flex-col transition-all ${
                    snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 text-sm">{column.title}</h2>
                    <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {tasks[column.id]?.length || 0}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {(tasks[column.id] || []).map((task, index) => (
                      <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all ${snapshot.isDragging ? 'opacity-50' : 'opacity-100'}`}
                          >
                            <TaskCard task={task} onEdit={() => {}} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Task</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Title</label>
                <input type="text" placeholder="Task title" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Description</label>
                <textarea placeholder="Task details..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 resize-none h-20" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Priority</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400">
                  <option>🔴 High</option>
                  <option>🟡 Medium</option>
                  <option>🟢 Low</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Assigned To</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400">
                  <option>Sara</option>
                  <option>Omar</option>
                  <option>Fatima</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Due Date</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Estimated Hours</label>
                <input type="number" placeholder="4" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400" />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddTask(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowAddTask(false)} className="flex-1 bg-cyan-600 text-white font-bold py-2.5 rounded-lg hover:bg-cyan-700">Save Task</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}