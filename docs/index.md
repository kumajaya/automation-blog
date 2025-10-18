---
layout: base
title: "Technical & Sustainability Digest"
---

<div class="posts-container">
{% for post in site.posts %}
  <div class="post-item" style="display:flex; flex-wrap:wrap; margin-bottom:1.5rem; align-items:flex-start;">
    {% if post.image %}
    <a href="{{ post.url | relative_url }}" style="flex:0 0 200px; margin-right:1rem; margin-bottom:0.5rem;">
      <img src="{{ post.image | relative_url }}" alt="{{ post.title }}" loading="lazy" style="width:100%; height:auto; object-fit:cover; border-radius:6px;">
    </a>
    {% endif %}
    <div class="post-text" style="flex:1 1 0; min-width:0;">
      <a href="{{ post.url | relative_url }}" style="font-weight:bold; font-size:1.1rem; color:#1e40af; text-decoration:none;">
        {{ post.title }}
      </a>
      <div style="font-size:0.875rem; color:#4b5563; margin-top:0.25rem;">
        {{ post.date | date: "%B %d, %Y" }}
        {% if post.author and post.author.size > 0 %} • {{ post.author | join: ", " }}{% endif %}
        — {{ post.excerpt | strip_html | truncate: 160 }}
      </div>
    </div>
  </div>
{% endfor %}
</div>

<style>
@media (max-width: 640px) {
  .post-item {
    flex-direction: column;
  }
  .post-item a img {
    margin-right: 0;
    margin-bottom: 0.5rem;
    width: 100%;
  }
}
</style>
