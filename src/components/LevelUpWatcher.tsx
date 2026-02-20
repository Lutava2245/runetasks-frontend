import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import useSkills from "../hooks/useSkills";
import { Sparkles } from "lucide-react";

export const LevelUpWatcher = () => {
  const { user } = useAuth();
  const { data: skills } = useSkills();
  const prevLevelUserRef = useRef(user?.level);
  const prevLevelSkillsRef = useRef(skills?.map((skill) => skill.level));

  useEffect(() => {
    if (user && prevLevelUserRef.current !== undefined) {
      if (user.level > 1 && user.level > prevLevelUserRef.current) {
        toast.success("Parabéns, você subiu de nível!", {
          icon: <Sparkles className="text-(--secondary)" />,
          description: `Lv ${prevLevelUserRef.current} -> Lv ${user.level}`
        });
      }
    }
    prevLevelUserRef.current = user?.level;
  }, [user?.level]);

  useEffect(() => {
    if (skills && prevLevelSkillsRef.current) {
      skills.forEach((skill, index) => {
        if (skill.level > 1 && skill.level !== (prevLevelSkillsRef.current?.[index])) {
          toast.success(`Parabéns, a habilidade ${skill?.name} subiu de nível!`, {
            icon: <Sparkles className="text-(--secondary)" />,
            description: `Lv ${prevLevelSkillsRef.current?.[index]} -> Lv ${skill?.level}`
          });
        }
      });
    }
    prevLevelSkillsRef.current = skills?.map((skill) => skill.level);
  }, [skills]);

  return null;
};