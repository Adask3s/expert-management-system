package de.cronn.expertmanagementsystem.service.search;

import de.cronn.expertmanagementsystem.model.ExpertSearchCriteriaDto;
import de.cronn.expertmanagementsystem.model.ExpertSearchCriteriaDto.OperatorEnum;
import de.cronn.expertmanagementsystem.model.ExpertSearchRequestDto.LogicalOperatorEnum;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.entry;

class SearchQueryBuilderTest {

    private SearchQueryBuilder queryBuilder;

    @Test
    void shouldBuildQueryWithOrLogic() {
        queryBuilder = new SearchQueryBuilder();
        ExpertSearchCriteriaDto crit = new ExpertSearchCriteriaDto();
        crit.setDomainName("Java");
        crit.setMinRankValue(4);
        crit.setOperator(OperatorEnum.GTE);

        SearchQuery searchQuery = queryBuilder.buildQuery(List.of(crit), LogicalOperatorEnum.OR);

        assertThat(searchQuery.sql())
                .contains("SELECT u.*")
                .contains("(LOWER(d.name) = LOWER(:domainName_0) AND e_level.rank_value >= :rankValue_0)")
                .contains("GROUP BY u.id")
                .doesNotContain("HAVING COUNT");

        assertThat(searchQuery.parameters())
                .contains(
                        entry("domainName_0", "Java"),
                        entry("rankValue_0", 4)
                )
                .doesNotContainKey("criteriaCount");
    }

    @Test
    void shouldBuildQueryWithAndLogic() {
        queryBuilder = new SearchQueryBuilder();
        ExpertSearchCriteriaDto crit1 = new ExpertSearchCriteriaDto();
        crit1.setDomainName("Java");
        crit1.setMinRankValue(4);
        crit1.setOperator(OperatorEnum.EQ);

        ExpertSearchCriteriaDto crit2 = new ExpertSearchCriteriaDto();
        crit2.setDomainName("Spring");
        crit2.setMinRankValue(2);
        crit2.setOperator(OperatorEnum.GTE);

        SearchQuery searchQuery = queryBuilder.buildQuery(List.of(crit1, crit2), LogicalOperatorEnum.AND);

        assertThat(searchQuery.sql())
                .contains("e_level.rank_value = :rankValue_0")
                .contains("e_level.rank_value >= :rankValue_1")
                .contains("HAVING COUNT(DISTINCT d.id) = :criteriaCount");

        assertThat(searchQuery.parameters())
                .contains(
                        entry("domainName_0", "Java"),
                        entry("rankValue_0", 4),
                        entry("domainName_1", "Spring"),
                        entry("rankValue_1", 2),
                        entry("criteriaCount", 2)
                );
    }
}