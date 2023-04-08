import Roact from "@rbxts/roact";
import { motion } from "./motion";
import useAnimation from "./useAnimation";

export interface AnimationTransition {
    duration: number
    easingStyle: Enum.EasingStyle
    easingDirection: Enum.EasingDirection
    reverses: boolean
    repeatCount: number
    delay: number
}

export type AnimationVariants<T> = Record<
    string,
    Partial<T> & {
        transition?: Partial<AnimationTransition>
    }
>

export interface WithAnimationProps<T extends GuiObject & Record<string, unknown>> {
    variants?: AnimationVariants<T>;
    initial?: keyof AnimationVariants<T> | (Partial<T> & { transition?: Partial<AnimationTransition> });
    animate?: keyof AnimationVariants<T> | (Partial<T> & { transition?: Partial<AnimationTransition> });
    transition?: Partial<AnimationTransition>;
    ref?: Roact.Ref<T>;
}

export { motion, useAnimation };