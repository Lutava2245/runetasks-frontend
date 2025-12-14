'use client';

import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Progress from "@/src/components/ui/Progress";
import SkillModal from "@/src/components/SkillModal";
import { useSkills } from "@/src/contexts/SkillContext";
import { useTasks } from "@/src/contexts/TaskContext";
import { SkillResponse } from "@/src/types/skill";
import { TaskResponse } from "@/src/types/task";
import { useState } from "react";

const Skills = () => {
  const { skills } = useSkills();
  const { tasks } = useTasks();

  const [completedTasks, setCompletedTasks] = useState<TaskResponse[]>(() => tasks.filter(t => t.status === "completed"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [targetSkill, setTargetSkill] = useState<SkillResponse | null>(null);

  const toggleCreate = () => {
    setFormType("create");
    setIsModalOpen(true);
  }

  const toggleEdit = (skillId: number) => {
    const skill = skills.find(s => s.id === skillId);
    setFormType("edit");
    setTargetSkill(skill || null);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="mystic-glow">Habilidades</span>
            </h2>
            <p className="text-muted-foreground text-xs">Evolua em cada área</p>
          </div>
          <Button
            onClick={toggleCreate}
            className="text-base py-1.5 px-4"
          >
            Criar
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-card border-2 border-primary/30 pixel-corners">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold text-foreground">{skills.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-2 border-secondary/30 pixel-corners">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Tarefas</p>
                <p className="text-2xl font-bold text-foreground">
                  {tasks.length - completedTasks.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-2 border-primary/30 pixel-corners">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Pontos</p>
                <p className="text-2xl font-bold text-foreground">
                  {skills.reduce((acc, skill) => acc + skill.totalXP, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {skills.map((skill) => (
            <button key={skill.id} onClick={() => toggleEdit(skill.id)}>
              <Card className="p-4 bg-card border-2 border-border/50 hover:border-blue-600 transition-all pixel-corners">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-foreground">{skill.name}</h3>
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        Lv {skill.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {completedTasks.filter(t => t.skillName === skill.name).length === 1
                        ? completedTasks.filter(t => t.skillName === skill.name).length + ' tarefa completa'
                        : completedTasks.filter(t => t.skillName === skill.name).length + ' tarefas completas'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="text-foreground font-bold">
                      {skill.levelPercentage}%
                    </span>
                  </div>
                  <Progress value={skill.levelPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-bold">-{skill.xpToNextLevel - skill.progressXP}</span> {'->'} Lv {skill.level + 1}
                  </p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formType={formType}
        skill={targetSkill}
      />
    </div>
  );
}

export default Skills;