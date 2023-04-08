import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import useAnimation, { AnimationTransition, AnimationVariants } from "./useAnimation";
import { withHooks } from "@rbxts/roact-hooked";

interface WithAnimationProps<T extends GuiObject & Record<string, unknown>> {
  variants?: AnimationVariants<T>;
  initial?: keyof AnimationVariants<T> | (Partial<T> & { transition?: Partial<AnimationTransition> });
  animate?: keyof AnimationVariants<T> | (Partial<T> & { transition?: Partial<AnimationTransition> });
  transition?: Partial<AnimationTransition>;
  ref?: Roact.Ref<T>;
}

function withAnimation<T extends keyof JSX.IntrinsicElements>(
  elementType: T
): (
  props: JSX.IntrinsicElements[T] & WithAnimationProps<GuiObject & Record<string, unknown>>
) => Roact.Element {
  return withHooks((
    props: JSX.IntrinsicElements[T] & WithAnimationProps<GuiObject & Record<string, unknown>>
  ) => {
    const { initial, animate, transition, variants } = props;
    const ref = Roact.createRef<GuiObject & Record<string, unknown>>();
    const [, setVariant] = useAnimation<GuiObject & Record<string, unknown>>(
      variants ?? {},
      props.ref ?? ref,
      initial,
      animate,
      transition
    );
    const rest = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) =>
          !["initial", "animate", "transition", "variants", "ref"].includes(
            key as unknown as string
          )
      ) as readonly (readonly [string | number | symbol, unknown])[]
    ) as JSX.IntrinsicElements[T];

    return Roact.createElement(elementType as keyof CreatableInstances, { 
        ...rest as JSX.IntrinsicElements[T], 
        [Roact.Ref]: props.ref ?? ref,
      });
  });
}

export const motion = {
  frame: withAnimation("Frame" as "frame"),
  textlabel: withAnimation("TextLabel" as "textlabel"),
  textbutton: withAnimation("TextButton" as "textbutton"),
  imagebutton: withAnimation("ImageButton" as "imagebutton"),
  scrollingframe: withAnimation("ScrollingFrame" as "scrollingframe"),
  uilistlayout: withAnimation("UIListLayout" as "uilistlayout"),
  uigridlayout: withAnimation("UIGridLayout" as "uigridlayout"),
  uipadding: withAnimation("UIPadding" as "uipadding"),
  uisizeconstraint: withAnimation("UISizeConstraint" as "uisizeconstraint"),
  uicorner: withAnimation("UICorner" as "uicorner"),
  uistroke: withAnimation("UIStroke" as "uistroke"),
  textbox: withAnimation("TextBox" as "textbox"),
  imagelabel: withAnimation("ImageLabel" as "imagelabel"),
}