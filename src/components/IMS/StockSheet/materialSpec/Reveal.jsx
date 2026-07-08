import { motion } from "framer-motion";

const MotionDiv = motion.div;

/**
 * Animates its children in (fade + slight slide) when it mounts — i.e. when a
 * conditionally-rendered field group first appears after a dependent selection.
 * Uses opacity/transform only (no height/overflow) so dropdown menus inside are
 * never clipped.
 */
const Reveal = ({ children, className, style }) => (
  <MotionDiv
    className={className}
    style={style}
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {children}
  </MotionDiv>
);

export default Reveal;
