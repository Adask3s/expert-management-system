package de.cronn.expertmanagementsystem.service.search;

import de.cronn.expertmanagementsystem.model.ExpertSearchCriteriaDto;
import de.cronn.expertmanagementsystem.model.ExpertSearchRequestDto;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class SearchCriteriaBuilder {

    public List<ExpertSearchCriteriaDto> build(ExpertSearchRequestDto searchRequestDto) {
        List<ExpertSearchCriteriaDto> criteriaDtoList = searchRequestDto.getCriteria();

        if (criteriaDtoList == null || criteriaDtoList.isEmpty()) {
            return Collections.emptyList();
        }

        return criteriaDtoList.stream()
                .collect(Collectors.toMap(
                        crit -> crit.getDomainName().toLowerCase().trim(),
                        crit -> crit,
                        (existing, replacement) -> {
                            if (Objects.equals(replacement.getMinRankValue(), existing.getMinRankValue())) {
                                return replacement.getOperator() == ExpertSearchCriteriaDto.OperatorEnum.GTE ? replacement : existing;
                            }
                            return replacement.getMinRankValue() > existing.getMinRankValue() ? replacement : existing;
                        }
                ))
                .values()
                .stream()
                .toList();
    }
}