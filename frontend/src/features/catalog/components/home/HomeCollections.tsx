import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { LABELS } from "@/constants/labels";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useCategories } from "../../hooks/useProducts";

export function HomeCollections() {
  const { data, isLoading, isError, isFetching, refetch } = useCategories({ silentError: true });
  const categories = data?.results.slice(0, 4) ?? [];

  return (
    <section
      className="store-container home-section collections-section"
      id="collections"
      aria-labelledby="collections-heading"
    >
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">{LABELS.home.COLLECTION_EYEBROW}</p>
          <h2 id="collections-heading">{LABELS.navigation.SEARCH_TITLE}</h2>
        </div>
        <LinkCommon className="store-text-link" to="/catalog">
          {LABELS.home.EXPLORE_ALL}
          <ArrowRight size={17} />
        </LinkCommon>
      </div>

      {isLoading && <LoadingOverlay />}
      {!isLoading && categories.length === 0 && (
        <div className="home-empty-state">
          <p role={isError ? "alert" : "status"}>
            {isError ? LABELS.home.COLLECTION_ERROR : LABELS.home.COLLECTION_EMPTY}
          </p>
          {isError && (
            <ButtonCommon variant="outline" isLoading={isFetching} onClick={() => void refetch()}>
              {LABELS.home.RETRY}
            </ButtonCommon>
          )}
        </div>
      )}
      {categories.length > 0 && (
        <div className="collections-grid">
          {categories.map((category) => (
            <LinkCommon
              key={category.id}
              className="collection-card"
              to={`/catalog?category=${encodeURIComponent(category.slug)}`}
            >
              {category.image_url && (
                <div className="collection-image">
                  <img src={category.image_url} alt="" loading="lazy" width={480} height={350} />
                </div>
              )}
              <div className="collection-caption">
                <div>
                  <h3>{category.name}</h3>
                  {category.description && <p>{category.description}</p>}
                </div>
                <ArrowUpRight size={17} strokeWidth={1.4} aria-hidden="true" />
              </div>
            </LinkCommon>
          ))}
        </div>
      )}
    </section>
  );
}
