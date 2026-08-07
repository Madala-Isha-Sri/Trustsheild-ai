export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-blob" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-cyan-500/20 blur-[120px] animate-blob" style={{ animationDelay: "4s" }}></div>
    </div>
  );
}
