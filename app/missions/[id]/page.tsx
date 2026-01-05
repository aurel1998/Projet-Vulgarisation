import missionsData from "@/data/missions.json";
import MissionClient from "@/components/MissionClient";

export async function generateStaticParams() {
  return missionsData.map((mission) => ({
    id: mission.id.toString(),
  }));
}

export default function MissionPage({ params }: { params: { id: string } }) {
  const missionId = parseInt(params.id);
  const mission = missionsData.find(m => m.id === missionId);

  if (!mission) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Mission introuvable</h1>
        <p className="text-foreground-muted mb-4">La mission demandée n&apos;existe pas.</p>
      </div>
    );
  }

  return <MissionClient missionId={missionId} mission={mission} />;
}
