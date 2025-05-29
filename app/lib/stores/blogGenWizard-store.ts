import { create } from "zustand";
import { produce } from "immer";

type BlogGenWizardStore = {
  step: number;
  setStep: (step: number) => void;
  title: string;
  setTitle: (title: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  style: string;
  setStyle: (style: string) => void;
  audience: string;
  setAudience: (audience: string) => void;
  keywords: string;
  setKeywords: (keywords: string) => void;
  originalBlog: string;
  setOriginalBlog: (originalBlog: string) => void;
  getOriginalBlog: () => string;
  derivedType: string;
  setDerivedType: (derivedType: string) => void;
  derivedContent: string;
  setDerivedContent: (derivedContent: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
};

export const useBlogGenWizardStore = create<BlogGenWizardStore>((set, get) => ({
  step: 1,
  title: "",
  topic: "",
  style: "",
  audience: "",
  keywords: "",
  originalBlog: "",
  derivedType: "",
  derivedContent: "",
  isGenerating: false,
  setStep: (step) =>
    set(
      produce((state) => {
        state.step = step;
      }),
    ),
  setTitle: (title) =>
    set(
      produce((state) => {
        state.title = title;
      }),
    ),
  setTopic: (topic) =>
    set(
      produce((state) => {
        state.topic = topic;
      }),
    ),
  setStyle: (style) =>
    set(
      produce((state) => {
        state.style = style;
      }),
    ),
  setAudience: (audience) =>
    set(
      produce((state) => {
        state.audience = audience;
      }),
    ),
  setKeywords: (keywords) =>
    set(
      produce((state) => {
        state.keywords = keywords;
      }),
    ),
  setOriginalBlog: (originalBlog) =>
    set(
      produce((state) => {
        state.originalBlog = originalBlog;
      }),
    ),
  getOriginalBlog: () => get().originalBlog,
  setDerivedType: (derivedType) =>
    set(
      produce((state) => {
        state.derivedType = derivedType;
      }),
    ),
  setDerivedContent: (derivedContent) =>
    set(
      produce((state) => {
        state.derivedContent = derivedContent;
      }),
    ),
  setIsGenerating: (isGenerating) =>
    set(
      produce((state) => {
        state.isGenerating = isGenerating;
      }),
    ),
}));
