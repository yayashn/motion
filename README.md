# animotion

## Introduction

Simply animate UI from point A to B with animotion, a simple yet powerful animation library for Roblox-TS & Roact, inspired by the popular framer-motion library for React.

## The motion component

The core of animotion is the motion object. Think of it as a plain Roblox GUI element, supercharged with animation capabilities.

```ts
import { motion } from "@rbxts/animotion";
```

Animating a motion component is as straightforward as setting values on the animate prop.

```tsx
<motion.textbutton animate={{ Position: new UDim2(0.5, 100, 0.5, 0) }} />
```

When these values change, animotion will automatically generate an animation to the latest values. This animation will feel great by default, but it can be configured with the flexible transition prop.

## Variants

Variants can be used to animate entire sub-trees of components with a single animate prop. They can be used to declaratively orchestrate these animations.

```tsx
const [state, setState] = useState<"hover" | "default">("default");

const buttonVariants = {
  hover: {
    TextColor3: new Color3(0, 1, 0),
  },
  off: {
    TextColor3: new Color3(1, 1, 1),
  },
};

return (
  <motion.textbutton
    animate={state}
    Event={{
      MouseEnter: () => {
        setState("hover");
      },
      MouseLeave: () => {
        setState("off");
      },
    }}
    variants={buttonVariants}
  />
);
```

## Transitions

A transition defines how values animate from one state to another. It defines the type of animation used when animating between two values.

```tsx
<motion.textbutton
  animate={{ Position: new UDim2(0.5, 100, 0.5, 0) }}
  transition={{
    duration: 1,
    easingStyle: Enum.EasingStyle.Quad,
    easingDirection: Enum.EasingDirection.Out,
    delay: 0.5,
    repeatCount: 0, // -1 for infinity
    reverse: false,
  }}
/>
```

Transitions can also be used in variants. If used in variants and as a prop simultaneously, the transitions
will merge into 1 transition. And in the case of a clash between transitions, the transition prop has priority
over the variants.

```tsx
const [state, setState] = useState<"hover" | "default">("default")

const buttonVariants = {
  hover: {
    TextColor3: new Color3(0, 1, 0),
    transition={{ 
        duration: 1,
        easingStyle: Enum.EasingStyle.Quad, 
        easingDirection: Enum.EasingDirection.Out, 
        delay: 0.5
    }}
  },
  default: {
    TextColor3: new Color3(1, 1, 1),
    transition={{ 
        duration: 1,
        easingStyle:
        Enum.EasingStyle.Quad, 
        easingDirection:
        Enum.EasingDirection.Out, 
        delay: 0.5
    }}
  },
};

return (
  <motion.textbutton
    animate={state}
    tansition={{
        duration: 20
    }}
    Event={{
      MouseEnter: () => {
        setState("hover");
      },
      MouseLeave: () => {
        setState("default");
      },
    }}
    variants={buttonVariants}
  />
);
```

## Copy & Paste Example

```tsx
import Roact from '@rbxts/roact'
import { useState, withHooks } from '@rbxts/roact-hooked'
import { motion } from '@rbxts/animotion'

const variants = {
    off: {
        BackgroundColor3: Color3.fromRGB(255, 255, 255),
        TextColor3: Color3.fromRGB(0, 0, 0),
        Size: new UDim2(0, 300, 0, 100)
    },
    on: {
        BackgroundColor3: Color3.fromRGB(0, 0, 0),
        TextColor3: Color3.fromRGB(255, 255, 255),
        Size: new UDim2(0, 300, 0, 90)
    }
}

const Button = withHooks(() => {
    const [state, setState] = useState<'on' | 'off'>('off')

    return (
        <motion.textbutton
            Text="Hello"
            Event={{
                MouseEnter: () => {
                    setState('on')
                },
                MouseLeave: () => {
                    setState('off')
                }
            }}
            transition={{
                duration: 0.3
            }}
            TextSize={20}
            Size={new UDim2(0, 300, 0, 100)}
            variants={variants}
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={new UDim2(0.5, 0, 0.5, 0)}
            animate={state}
        >
            <motion.uicorner
                animate={{
                    CornerRadius: state === 'on' ? new UDim(0, 20) : new UDim(0, 0)
                }}
                transition={{
                    duration: 0.3
                }}
            />
        </motion.textbutton>
    )
})

export = (target: Instance) => {
    let tree = Roact.mount(
        <Button />,
        target,
        'UI'
    )

    return () => {
        Roact.unmount(tree)
    }
}
```