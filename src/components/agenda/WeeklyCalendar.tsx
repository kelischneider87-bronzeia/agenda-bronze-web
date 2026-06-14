"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import AppointmentCard from "./AppointmentCard";

interface Agendamento {
  id: string;
  cliente_nome: string;
  data: string;
  hora: string;
  valor: number;
  status: string;
  sinal?: number;
  sinal_pago?: boolean;
  forma_pagamento?: string;
  observacoes?: string;
}

interface DiaSemana {
  label: string;
  data: string;
}

interface Props {
  dias: DiaSemana[];
  horarios: string[];
  agendamentos: Agendamento[];
  onNovoAgendamento: (
    data: string,
    hora: string
  ) => void;
  onEditarAgendamento: (
    agendamento: Agendamento
  ) => void;
  onDragEnd: (result: DropResult) => void;
}

export default function WeeklyCalendar({
  dias,
  horarios,
  agendamentos,
  onNovoAgendamento,
  onEditarAgendamento,
  onDragEnd,
}: Props) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="overflow-auto rounded-3xl border border-zinc-800 bg-zinc-950">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-zinc-800">
          <div className="border-r border-zinc-800 p-4" />

          {dias.map((dia) => (
            <div
              key={dia.data}
              className="border-r border-zinc-800 p-4 text-center"
            >
              <h2 className="font-semibold capitalize text-white">
                {dia.label}
              </h2>
            </div>
          ))}
        </div>

        {horarios.map((horario) => (
          <div
            key={horario}
            className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-zinc-900"
          >
            <div className="border-r border-zinc-900 px-2 py-3 text-xs text-zinc-500">
              {horario}
            </div>

            {dias.map((dia) => {
              const agendamento = agendamentos.find(
                (item) =>
                  item.hora.slice(0, 5) === horario &&
                  item.data === dia.data
              );

              return (
                <Droppable
                  key={dia.data + horario}
                  droppableId={`${dia.data}|${horario}`}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      onClick={() => {
                        if (!agendamento) {
                          onNovoAgendamento(
                            dia.data,
                            horario
                          );
                        }
                      }}
                      className="h-[8mm] cursor-pointer border-r border-zinc-900 p-1 transition-all hover:bg-zinc-900/40"
                    >
                      {agendamento && (
                        <Draggable
                          draggableId={agendamento.id}
                          index={0}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={(event) => {
                                event.stopPropagation();
                                onEditarAgendamento(
                                  agendamento
                                );
                              }}
                              className="h-full"
                            >
                              <AppointmentCard
                                cliente={
                                  agendamento.cliente_nome
                                }
                                valor={
                                  agendamento.valor
                                }
                                status={
                                  agendamento.status
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}