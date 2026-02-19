import "dotenv/config";
import { db, projects, features, tasks, decisions } from "./index";
import { mockProjects, mockDecisions } from "../mockData";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Map old IDs to new UUIDs
    const projectIdMap = new Map<string, string>();
    const featureIdMap = new Map<string, string>();

    // Insert projects with nested data
    for (const project of mockProjects) {
      const [insertedProject] = await db
        .insert(projects)
        .values({
          name: project.name,
          description: project.description,
          status: project.status,
          techStack: project.techStack,
          lastUpdated: new Date(project.lastUpdated),
        })
        .returning();

      projectIdMap.set(project.id, insertedProject.id);
      console.log(`✅ Inserted project: ${insertedProject.name}`);

      // Insert features for this project
      for (const feature of project.features) {
        const [insertedFeature] = await db
          .insert(features)
          .values({
            name: feature.name,
            description: feature.description,
            priority: feature.priority,
            status: feature.status,
            effortEstimate: feature.effortEstimate,
            projectId: insertedProject.id,
          })
          .returning();

        featureIdMap.set(feature.id, insertedFeature.id);

        // Insert tasks for this feature
        for (const task of feature.tasks) {
          await db.insert(tasks).values({
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            effortEstimate: task.effortEstimate,
            featureId: insertedFeature.id,
          });
        }
      }
    }

    // Insert decisions with mapped feature IDs
    for (const decision of mockDecisions) {
      const newFeatureId = featureIdMap.get(decision.featureId);
      if (newFeatureId) {
        await db.insert(decisions).values({
          date: new Date(decision.date),
          text: decision.text,
          pros: decision.pros,
          cons: decision.cons,
          alternatives: decision.alternatives,
          featureId: newFeatureId,
        });
      }
    }

    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
