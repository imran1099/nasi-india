"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { NewsArticle } from "@/data/news";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarIcon, SearchIcon, ArrowRightIcon } from "@/components/icons";

export interface NewsDirectoryProps {
  articles: NewsArticle[];
}

export function NewsDirectory({ articles }: NewsDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [articles]);

  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.isFeatured) || articles[0];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.clubAttribution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat =
        selectedCategory === "all" || article.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [articles, searchTerm, selectedCategory]);

  return (
    <div className="space-y-12">
      {/* Featured Article Hero Card */}
      {featuredArticle && !searchTerm && selectedCategory === "all" && (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 text-white shadow-md relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="teal" size="sm" className="bg-teal-900/80 text-teal-200 border-teal-700">
                Featured Report
              </Badge>
              <span className="text-xs font-mono text-sand-300">
                Attribution: {featuredArticle.clubAttribution}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
              {featuredArticle.title}
            </h2>

            <p className="text-sm sm:text-base text-sand-200 leading-relaxed">
              {featuredArticle.excerpt}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-sand-300">
                <CalendarIcon size={14} className="text-teal-400" />
                <time dateTime={featuredArticle.isoDate}>{featuredArticle.date}</time>
                <span>•</span>
                <span>{featuredArticle.readTime}</span>
              </div>

              <Link
                href={`/news/${featuredArticle.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 text-white text-sm font-medium hover:bg-teal-600 transition-colors shadow-xs"
              >
                <span>Read Full Article</span>
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-2xl bg-sand-50 border border-sand-200 shadow-2xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search news by topic, title, or club..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-forest-950 placeholder:text-forest-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest-700 transition-colors"
            />
            <span className="absolute left-3 top-3 text-forest-400 pointer-events-none">
              <SearchIcon size={16} />
            </span>
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-forest-800 text-white shadow-xs"
                  : "bg-white text-forest-800 border border-sand-300 hover:bg-sand-100"
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-forest-800 text-white shadow-xs"
                    : "bg-white text-forest-800 border border-sand-300 hover:bg-sand-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="mt-3 pt-3 border-t border-sand-200 flex items-center justify-between text-xs text-forest-600">
          <span>Showing {filteredArticles.length} of {articles.length} sample articles</span>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-teal-800 underline hover:text-forest-950 cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.slug}
              variant="elevated"
              className="flex flex-col justify-between h-full group hover:border-forest-400 transition-all duration-200"
            >
              <div>
                {/* Visual Image Placeholder */}
                <div className="relative h-44 w-full bg-gradient-to-br from-forest-800 to-teal-900 p-4 text-white flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="teal" size="sm" className="bg-teal-900/80 text-teal-200 border-teal-700">
                      {article.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-sand-300">
                      {article.readTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-teal-300 uppercase tracking-wider block">
                      Attribution: {article.clubAttribution}
                    </span>
                  </div>
                </div>

                <CardHeader className="pt-4 pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-forest-600 mb-2">
                    <CalendarIcon size={14} className="text-teal-600 shrink-0" />
                    <time dateTime={article.isoDate}>{article.date}</time>
                  </div>

                  <CardTitle as="h3" className="text-lg group-hover:text-forest-800 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-xs text-forest-800/80 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </CardContent>
              </div>

              <CardFooter className="pt-3 border-t border-sand-100 bg-sand-50/50 flex items-center justify-between">
                <span className="text-[11px] text-forest-500 italic">Sample Publication</span>
                <Link
                  href={`/news/${article.slug}`}
                  className="text-xs font-semibold text-teal-800 group-hover:text-forest-950 inline-flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Articles Match Your Search"
          description="Try broadening your search term or switching back to 'All Topics' to see all national news and updates."
          action={
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-lg bg-forest-800 text-white text-sm font-medium hover:bg-forest-900 transition-colors"
            >
              Reset Filters
            </button>
          }
        />
      )}
    </div>
  );
}
