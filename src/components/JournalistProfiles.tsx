import { JOURNALIST_LIST } from "@/lib/journalists";
import JournalistIcon from "./JournalistIcon";

export default function JournalistProfiles() {
  return (
    <section id="journalists" className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-text-primary mb-3">
          Our Journalists
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Nine specialist AI journalists, each bringing a distinct
          perspective to the most important AI business stories.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {JOURNALIST_LIST.map((j) => (
          <div
            key={j.key}
            className="rounded-lg border border-border p-5 transition-all duration-300 hover:border-border-hover"
            style={{
              background: `linear-gradient(135deg, ${j.color}08, transparent 60%)`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${j.color}20`,
                  color: j.color,
                }}
              >
                <JournalistIcon icon={j.icon} size={20} />
              </div>
              <div>
                <div
                  className="text-sm font-bold"
                  style={{ color: j.color }}
                >
                  {j.name}
                </div>
                <div className="text-xs text-text-muted font-mono">
                  {j.title}
                </div>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {j.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
