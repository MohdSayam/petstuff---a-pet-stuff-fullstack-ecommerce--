export default function Pawloader() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3 text-5xl">
        <span className="animate-bounce [animation-delay:0ms]">🐾</span>
        <span className="animate-bounce [animation-delay:150ms]">🐾</span>
        <span className="animate-bounce [animation-delay:300ms]">🐾</span>
        <span className="animate-bounce [animation-delay:450ms]">🐾</span>
      </div>
      <p className="text-xl font-bold text-brand-primary animate-pulse tracking-wide">
        Loading PetStuff...
      </p>
    </div>
  )
}