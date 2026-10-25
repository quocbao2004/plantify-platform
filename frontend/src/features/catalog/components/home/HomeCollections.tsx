import { LinkCommon } from "@/components/common/LinkCommon";
import { LABELS } from "@/constants/labels";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { homeCollections } from "../../constants/homeContent";

export function HomeCollections() {
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
      <div className="collections-grid">
        {homeCollections.map((collection) => (
          <LinkCommon
            key={collection.title}
            className="collection-card"
            to={`/catalog?${collection.query}`}
          >
            <div className="collection-image">
              <img
                src={collection.image}
                alt={collection.title}
                style={{ objectPosition: collection.imagePosition }}
                loading="lazy"
                width={480}
                height={350}
              />
            </div>
            <div className="collection-caption">
              <div>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </div>
              <ArrowUpRight size={17} strokeWidth={1.4} aria-hidden="true" />
            </div>
          </LinkCommon>
        ))}
      </div>
    </section>
  );
}
