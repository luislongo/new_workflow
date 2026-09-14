import figma from "@figma/code-connect";
import { Button, DangerButton, HeroButton } from "@ds/core";
import App from "./App";

// Replace FIGMA_URL with the link to the screen frame in Figma:
// Select the top-level frame → right-click → "Copy link to selection"
figma.connect(App, "FIGMA_URL", {
  example: () => (
    <App />
  ),
});

// ─── Individual component instances within the screen ──────────────────────
// Each figma.connect below documents one reusable component on this screen.
// Copy the node URL for each instance and add more as the screen grows.

figma.connect(Button, "FIGMA_URL", {
  props: {
    variant: figma.enum("Variant", {
      Primary: "primary",
      Secondary: "secondary",
      Tertiary: "tertiary",
    }),
    children: figma.string("Label"),
    disabled: figma.enum("State", { Disabled: true }),
  },
  example: ({ variant, children, disabled }) => (
    <Button variant={variant} disabled={disabled}>
      {children}
    </Button>
  ),
});

figma.connect(DangerButton, "FIGMA_URL", {
  props: {
    variant: figma.enum("Variant", {
      Primary: "primary",
      Secondary: "secondary",
      Tertiary: "tertiary",
    }),
    children: figma.string("Label"),
  },
  example: ({ variant, children }) => (
    <DangerButton variant={variant}>{children}</DangerButton>
  ),
});

figma.connect(HeroButton, "FIGMA_URL", {
  props: {
    variant: figma.enum("Variant", {
      Primary: "primary",
      Secondary: "secondary",
    }),
    children: figma.string("Label"),
  },
  example: ({ variant, children }) => (
    <HeroButton variant={variant}>{children}</HeroButton>
  ),
});
