package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.model.ExpertiseLevelDto;
import de.cronn.expertmanagementsystem.service.ExpertiseLevelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ExpertiseLevelControllerTest {

    @Mock
    private ExpertiseLevelService expertiseLevelService;

    @InjectMocks
    private ExpertiseLevelController expertiseLevelController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(expertiseLevelController).build();
    }

    @Test
    void shouldReturnAllExpertiseLevels() throws Exception {
        // given
        ExpertiseLevelDto beginner = new ExpertiseLevelDto();
        beginner.setId(1);
        beginner.setName("Beginner");
        beginner.setRankValue(1);

        ExpertiseLevelDto advanced = new ExpertiseLevelDto();
        advanced.setId(2);
        advanced.setName("Advanced");
        advanced.setRankValue(5);

        List<ExpertiseLevelDto> expectedLevels = List.of(beginner, advanced);

        when(expertiseLevelService.getAllExpertiseLevels()).thenReturn(expectedLevels);

        // when & then
        mockMvc.perform(get("/expertise-levels")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Beginner"))
                .andExpect(jsonPath("$[0].rankValue").value(1))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Advanced"))
                .andExpect(jsonPath("$[1].rankValue").value(5));

        verify(expertiseLevelService).getAllExpertiseLevels();
    }

    @Test
    void shouldReturnEmptyListWhenNoLevelsExist() throws Exception {
        // given
        when(expertiseLevelService.getAllExpertiseLevels()).thenReturn(List.of());

        // when & then
        mockMvc.perform(get("/expertise-levels")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(expertiseLevelService).getAllExpertiseLevels();
    }
}