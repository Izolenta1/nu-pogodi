import { useEffect } from "react";
import { gameEngine } from "@/entities/game";

export const useGameKeyboard = (): void => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (e.repeat) return;

            switch (e.key.toLowerCase()) {
                case "1":
                    gameEngine.startA();
                    break;
                case "2":
                    gameEngine.startB();
                    break;
                case "3":
                    gameEngine.idle();
                    break;
                case "q":
                    gameEngine.moveWolf("leftUp", true);
                    break;
                case "a":
                    gameEngine.moveWolf("leftDown", true);
                    break;
                case "e":
                    gameEngine.moveWolf("rightUp", true);
                    break;
                case "d":
                    gameEngine.moveWolf("rightDown", true);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameEngine]);
};