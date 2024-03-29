import { Chapter } from "@prisma/client";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Grip, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChaptersListProps {
  onEdit: (id: string) => void;
  onReorder: (updateData: { id: string; position: number }[]) => void;
  items: Chapter[];
}

export const ChaptersList = ({
  onEdit,
  onReorder,
  items,
}: ChaptersListProps) => {
  const [chapters, setChapters] = useState(items);
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const elementos = reorder(
      items,
      result.source.index,
      result.destination.index,
    );
    setChapters(elementos);

    const bulkUpdatedData = elementos.map((e) => ({
      id: e.id,
      position: elementos.findIndex((item) => item.id === e.id),
    }));

    onReorder(bulkUpdatedData);
  };

  const reorder = (list: Chapter[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md  mb-4 text-sm",
                      item.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700",
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        item.isPublished && "border-r-sky-200 hover:bg-sky-200",
                      )}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {item.title}
                    <div className="ml-auto flex pr-2 items-center gap-x-2">
                      {item.isFree && <Badge>Gratis</Badge>}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          item.isPublished && "bg-sky-700",
                        )}
                      >
                        {item.isPublished ? "Publicado" : "Borrador"}{" "}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(item.id)}
                        className="h-4 w-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
