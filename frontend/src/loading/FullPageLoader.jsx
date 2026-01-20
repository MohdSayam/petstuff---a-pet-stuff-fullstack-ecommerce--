import Pawloader from "./Pawloader";

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <Pawloader />
    </div>
  )
}