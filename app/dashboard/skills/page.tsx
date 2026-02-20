'use client';

import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Progress from "@/src/components/ui/Progress";
import SkillModal from "@/src/components/SkillModal";
import { SkillResponse } from "@/src/types/skill";
import { useState } from "react";
import { Briefcase, Dumbbell, GraduationCap, Heart, Home, Landmark, Lightbulb, Plane, ShoppingBag, Users } from "lucide-react";
import useSkills from "@/src/hooks/useSkills";
import useTasks from "@/src/hooks/useTasks";

const Skills = () => {
  const { data: skills = [] } = useSkills();
  const { data: tasks = [] } = useTasks();

  const completedTasks = tasks.filter(t => t.status === "COMPLETED");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [targetSkill, setTargetSkill] = useState<SkillResponse | null>(null);

  const getSkillIcon = (skill: SkillResponse) => {
    switch (skill.icon) {
      case 'personal':
        return <Users className="h-20 w-20" />;

      case 'work':
        return <Briefcase className="h-20 w-20" />;

      case 'study':
        return <GraduationCap className="h-20 w-20" />

      case 'home':
        return <Home className="h-20 w-20" />

      case 'health':
        return <Heart className="h-20 w-20" />

      case 'exercise':
        return <Dumbbell className="h-20 w-20" />

      case 'money':
        return <Landmark className="h-20 w-20" />

      case 'shopping':
        return <ShoppingBag className="h-20 w-20" />

      case 'travel':
        return <Plane className="h-20 w-20" />

      case 'idea':
        return <Lightbulb className="h-20 w-20" />

      default:
        break;
    }
  }

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
    <div className="mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Habilidades</h2>
          <p className="text-sm">Evolua em cada área</p>
        </div>
        <Button
          onClick={toggleCreate}
          className="py-1.5 px-4"
        >
          Criar
        </Button>
      </div>

      <div className="grid md:col-span-2 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-2 hover:border-(--primary)/30 transition-all">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs ">Total de Habilidades</p>
                <p className="text-2xl font-bold text-foreground">{skills.length}</p>
              </div>
            </div>
          </Card>

          <Card className="border-2 hover:border-(--secondary)/30 transition-all">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs ">Tarefas Concluídas</p>
                <p className="text-2xl font-bold text-foreground">
                  {completedTasks.length + "/" + tasks.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {skills.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {skills.map((skill) => (
              <Card
                key={skill.id}
                onClick={() => toggleEdit(skill.id)}
                className="border-2 border-(--primary) hover:border-(--secondary) hover:scale-105 transition-all flex justify-center items-center"
              >
                <div className="flex items-center justify-center border transition-transform bg-background border-(--primary) rounded-xl p-2 mr-3">
                  {getSkillIcon(skill)}
                </div>

                <div className="w-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-foreground">{skill.name}</h3>
                        <Badge className="flex items-center gap-1 text-xs">
                          Lv {skill.level}
                        </Badge>
                      </div>
                      <p className="text-xs  mb-2">
                        {skill.totalTasks === 0
                          ? 'Nenhuma tarefa'
                          : (
                            skill.totalTasks === 1
                              ? skill.totalTasks + ' tarefa'
                              : skill.totalTasks + ' tarefas'
                          )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="">Progresso do Nível</span>
                      <span className="text-foreground font-bold">
                        {skill.levelPercentage}%
                      </span>
                    </div>
                    <Progress value={skill.levelPercentage} className="h-2" />
                    <p className="text-xs ">
                      <span className="text-(--secondary) font-bold">-{skill.xpToNextLevel - skill.progressXp}</span> {'->'} Lv {skill.level + 1}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {skills.length === 0 && (
          <Card className="p-8 border-2 border-dashed text-center ">
            <p className="text-sm">Nenhuma habilidade criada</p>
          </Card>
        )}
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