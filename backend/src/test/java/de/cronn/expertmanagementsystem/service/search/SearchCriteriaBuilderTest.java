package de.cronn.expertmanagementsystem.service.search;

import de.cronn.expertmanagementsystem.model.ExpertSearchCriteriaDto;
import de.cronn.expertmanagementsystem.model.ExpertSearchCriteriaDto.OperatorEnum;
import de.cronn.expertmanagementsystem.model.ExpertSearchRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SearchCriteriaBuilderTest {

    private SearchCriteriaBuilder criteriaBuilder;

    @BeforeEach
    void setUp() {
        criteriaBuilder = new SearchCriteriaBuilder();
    }

    @Test
    void shouldReturnEmptyListWhenCriteriaIsNull() {
        ExpertSearchRequestDto request = new ExpertSearchRequestDto();
        request.setCriteria(null);

        List<ExpertSearchCriteriaDto> result = criteriaBuilder.build(request);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnEmptyListWhenCriteriaIsEmpty() {
        ExpertSearchRequestDto request = new ExpertSearchRequestDto();
        request.setCriteria(Collections.emptyList());

        List<ExpertSearchCriteriaDto> result = criteriaBuilder.build(request);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldKeepHigherRankValueWhenDuplicateDomainsExist() {
        ExpertSearchCriteriaDto lowerRankCrit = new ExpertSearchCriteriaDto();
        lowerRankCrit.setDomainName("Java");
        lowerRankCrit.setMinRankValue(3);
        lowerRankCrit.setOperator(OperatorEnum.GTE);

        ExpertSearchCriteriaDto higherRankCrit = new ExpertSearchCriteriaDto();
        higherRankCrit.setDomainName("java ");
        higherRankCrit.setMinRankValue(5);
        higherRankCrit.setOperator(OperatorEnum.GTE);

        ExpertSearchRequestDto request = new ExpertSearchRequestDto();
        request.setCriteria(List.of(lowerRankCrit, higherRankCrit));

        List<ExpertSearchCriteriaDto> result = criteriaBuilder.build(request);

        assertThat(result)
                .hasSize(1)
                .first()
                .extracting(ExpertSearchCriteriaDto::getMinRankValue)
                .isEqualTo(5);
    }

    @Test
    void shouldPreferGteOperatorWhenMinRankValuesAreEqual() {
        ExpertSearchCriteriaDto eqCrit = new ExpertSearchCriteriaDto();
        eqCrit.setDomainName("SQL");
        eqCrit.setMinRankValue(3);
        eqCrit.setOperator(OperatorEnum.EQ);

        ExpertSearchCriteriaDto gteCrit = new ExpertSearchCriteriaDto();
        gteCrit.setDomainName("sql");
        gteCrit.setMinRankValue(3);
        gteCrit.setOperator(OperatorEnum.GTE);

        ExpertSearchRequestDto request = new ExpertSearchRequestDto();
        request.setCriteria(List.of(eqCrit, gteCrit));

        List<ExpertSearchCriteriaDto> result = criteriaBuilder.build(request);

        assertThat(result)
                .hasSize(1)
                .first()
                .extracting(ExpertSearchCriteriaDto::getOperator)
                .isEqualTo(OperatorEnum.GTE);
    }
}