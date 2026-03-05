interface MadinaSvgProps {
  className?: string;
}

export function MadinaSvg({ className }: MadinaSvgProps) {
  return (
    <img
      src="/images/nabawi.png"
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
    />
  );
}
