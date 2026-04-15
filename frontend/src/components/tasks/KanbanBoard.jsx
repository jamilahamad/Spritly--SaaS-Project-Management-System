import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { HiPlus } from 'react-icons/hi';
import './KanbanBoard.css';
import TaskCard from './TaskCard';

const KanbanBoard = ({
  tasks,
  statuses = ['todo', 'in_progress', 'review', 'done'],
  onStatusChange,
  onTaskClick,
  onAddTask
}) => {
  const [columns, setColumns] = useState({});

  useEffect(() => {
    const groupedColumns = statuses.reduce((accumulator, status) => {
      accumulator[status] = tasks.filter((task) => task.status === status);
      return accumulator;
    }, {});

    setColumns(groupedColumns);
  }, [tasks, statuses]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      onStatusChange(draggableId, destination.droppableId);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'Review',
      done: 'Done'
    };

    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: 'bg-secondary-200',
      in_progress: 'bg-blue-200',
      review: 'bg-yellow-200',
      done: 'bg-green-200'
    };

    return colors[status] || 'bg-secondary-200';
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-250px)]">
        {statuses.map((status) => (
          <div
            key={status}
            className="kanban-column flex-shrink-0 w-25 bg-secondary-100 rounded-lg"
          >
            <div className="kanban-column-header p-3 flex items-center justify-between">
              <div className="kanban-column-title-row flex items-center gap-2">
                <span
                  className={`kanban-column-status-dot w-3 h-3 rounded-full ${getStatusColor(
                    status
                  )}`}
                />

                <h3 className="kanban-column-title font-medium text-secondary-700">
                  {getStatusLabel(status)}
                </h3>

                <span className="kanban-column-count text-xs text-secondary-500 bg-secondary-200 px-2 py-0.5 rounded-full">
                  {columns[status]?.length || 0}
                </span>
              </div>

              {status === 'todo' && (
                <button
                  type="button"
                  onClick={onAddTask}
                  className="kanban-column-add-button p-1 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-200 rounded"
                >
                  <HiPlus className="kanban-column-add-icon w-5 h-5" />
                </button>
              )}
            </div>

            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-column-body p-2 min-h-[200px] space-y-2 ${
                    snapshot.isDraggingOver ? 'bg-primary-50' : ''
                  }`}
                >
                  {columns[status]?.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className={`kanban-task-wrapper ${
                            dragSnapshot.isDragging ? 'opacity-50' : ''
                          }`}
                        >
                          <TaskCard
                            task={task}
                            onClick={() => onTaskClick(task)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;