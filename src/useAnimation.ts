import Object from '@rbxts/object-utils'
import Roact from '@rbxts/roact'
import { useEffect, useState } from '@rbxts/roact-hooked'
import { TweenService } from '@rbxts/services'

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

export default function useAnimation<T extends Instance>(
    variants: AnimationVariants<T>,
    ref: Roact.Ref<T>,
    initial?:
        | keyof AnimationVariants<T>
        | (Partial<T> & {
              transition?: Partial<AnimationTransition>
          }),
    animate?:
        | keyof AnimationVariants<T>
        | (Partial<T> & {
              transition?: Partial<AnimationTransition>
          }),
    transition?: Partial<AnimationTransition>
): [string, (variant: string) => void] {
    const [variantState, setVariantState] = useState<
        | keyof AnimationVariants<T>
        | (Partial<T> & {
              transition?: Partial<AnimationTransition>
          })
    >();
    const currentVariant = typeIs(variantState, 'string') ? variants[variantState] : variantState
    const animationVariant =
        animate !== undefined
            ? typeIs(animate, 'string')
                ? variants[animate]
                : animate
            : currentVariant

    let animationProperties: Partial<T> = {}
    let mergedTransition: Partial<AnimationTransition> = {}

    if(animationVariant) {
        animationProperties = Object.entries(animationVariant)
        .filter(([key]) => key !== 'transition')
        .reduce((acc, [key, value]) => {
            ;(acc as Record<string, unknown>)[key as string] = value
            return acc
        }, {} as Partial<T>)

        mergedTransition = {
            ...animationVariant.transition,
            ...transition
        }
    }
    useEffect(() => {
        const element = ref.getValue()
        if(!element) return

        Object.entries(initial ?? {}).forEach(([key, value]) => {
            if(key !== 'transition') {
                ;(element as Record<string, unknown>)[key as string] = value
            }
        })

        let tween: Tween | undefined;
        if(animationVariant) {
            tween = TweenService.Create(
                element,
                new TweenInfo(
                    mergedTransition.duration ?? 1,
                    mergedTransition.easingStyle ?? Enum.EasingStyle.Linear,
                    mergedTransition.easingDirection ?? Enum.EasingDirection.InOut,
                    mergedTransition.repeatCount ?? 0,
                    mergedTransition.reverses ?? false,
                    mergedTransition.delay ?? 0
                ),
                animationProperties
            )
    
            tween.Play()
        }

        return () => {
            tween?.Destroy()
        }
    }, [ref, variants, variantState, animate, transition])

    const setVariant = (variant: string) => {
        setVariantState(variant)
    }

    return [typeIs(variantState, 'string') ? variantState : '', setVariant]
}
