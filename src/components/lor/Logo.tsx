import logoImage from "@/assets/logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="League of Rap" 
        className="h-12 w-12 object-contain"
      />
    </div>
  );
}
