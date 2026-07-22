<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ProjectCategory, ProjectDefinition, ProjectStatus } from '../data/site';

const props = defineProps<{ projects: ProjectDefinition[] }>();
type Filter = 'all' | ProjectCategory | ProjectStatus;
const activeFilter = ref<Filter>('all');

const filters: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All tools' },
  { value: 'create', label: 'Create' },
  { value: 'plan', label: 'Plan' },
  { value: 'protect', label: 'Protect' },
  { value: 'live', label: 'Live now' },
];

const visibleProjects = computed(() => {
  if (activeFilter.value === 'all') return props.projects;
  return props.projects.filter(
    (project) => project.category === activeFilter.value || project.status === activeFilter.value,
  );
});

function labelForStatus(status: ProjectStatus) {
  return status === 'live' ? 'Live' : 'In development';
}
</script>

<template>
  <div class="explorer">
    <div class="filter-bar" role="group" aria-label="Filter projects">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        :class="{ active: activeFilter === filter.value }"
        :aria-pressed="activeFilter === filter.value"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <p class="result-count" aria-live="polite">
      Showing {{ visibleProjects.length }} {{ visibleProjects.length === 1 ? 'project' : 'projects' }}
    </p>

    <div class="explorer-grid">
      <article
        v-for="project in visibleProjects"
        :key="project.slug"
        class="project-card explorer-card"
        :class="`accent-${project.accent}`"
      >
        <div class="project-topline">
          <span class="project-mark" aria-hidden="true">{{ project.monogram }}</span>
          <span class="status" :class="{ live: project.status === 'live' }">
            <i aria-hidden="true"></i>{{ labelForStatus(project.status) }}
          </span>
        </div>
        <p class="eyebrow">{{ project.eyebrow }}</p>
        <h2>{{ project.name }}</h2>
        <p>{{ project.description }}</p>
        <ul class="feature-list">
          <li v-for="feature in project.features" :key="feature">{{ feature }}</li>
        </ul>
        <p class="privacy-line"><strong>Data boundary:</strong> {{ project.privacy }}</p>
        <div class="project-card-footer">
          <a v-if="project.url" class="button button-small" :href="project.url" rel="external">
            Open project <span aria-hidden="true">↗</span>
          </a>
          <span v-else class="availability">Production link will appear after launch</span>
          <span v-if="project.url && project.domainLabel" class="domain-label">{{ project.domainLabel }}</span>
        </div>
      </article>
    </div>
  </div>
</template>
