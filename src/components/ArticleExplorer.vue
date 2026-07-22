<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ArticleDefinition } from '../data/articles';

const props = defineProps<{ articles: ArticleDefinition[] }>();
type Topic = 'All' | ArticleDefinition['topic'];
const topics: Topic[] = ['All', 'Create', 'Plan', 'Protect', 'Principles'];
const activeTopic = ref<Topic>('All');

const visibleArticles = computed(() =>
  activeTopic.value === 'All'
    ? props.articles
    : props.articles.filter((article) => article.topic === activeTopic.value),
);

function articlePath(slug: string) {
  return `/articles/${slug}/`;
}
</script>

<template>
  <div class="article-explorer">
    <div class="index-toolbar">
      <p>Browse every field note</p>
      <p>{{ visibleArticles.length }} entries / Create, plan, protect</p>
    </div>
    <div class="note-filters" role="group" aria-label="Filter Field Notes by topic">
      <button
        v-for="topic in topics"
        :key="topic"
        type="button"
        :aria-pressed="activeTopic === topic"
        @click="activeTopic = topic"
      >
        {{ topic }}
      </button>
    </div>
    <p class="filter-result" aria-live="polite">
      Showing {{ visibleArticles.length }} {{ visibleArticles.length === 1 ? 'guide' : 'guides' }}
    </p>
    <div class="notes-list">
      <article v-for="(article, index) in visibleArticles" :key="article.slug" class="note-row">
        <p class="note-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</p>
        <div class="note-topic">
          <span>{{ article.topic }}</span>
          <span>{{ article.readTime }}</span>
        </div>
        <div class="note-copy">
          <h3><a :href="articlePath(article.slug)">{{ article.shortTitle }}</a></h3>
          <p>{{ article.description }}</p>
        </div>
        <a class="note-open" :href="articlePath(article.slug)" :aria-label="`Read ${article.shortTitle}`">
          <span>Read</span><span aria-hidden="true">&rarr;</span>
        </a>
      </article>
    </div>
  </div>
</template>
