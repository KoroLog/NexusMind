"use client";

import InteractionButtons from "./InteractionButtons";

type Props = {
  articleId: string;
};

export default function ArticleClientInteractions({ articleId }: Props) {
  return <InteractionButtons articleId={articleId} />;
}
