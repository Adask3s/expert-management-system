package de.cronn.expertmanagementsystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.cronn.expertmanagementsystem.config.SecurityConfig;
import de.cronn.expertmanagementsystem.model.UserSkillRequestDto;
import de.cronn.expertmanagementsystem.service.UserSkillService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserSkillController.class)
@Import(SecurityConfig.class)
class UserSkillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private UserSkillService userSkillService;

    @Nested
    @DisplayName("DELETE /user-skills/{id}")
    class DeleteUserSkillTests {

        @Test
        void shouldReturn204AndCallDeleteOnService() throws Exception {
            // given
            Integer skillId = 1;

            // when & then
            mockMvc.perform(delete("/user-skills/{id}", skillId))
                    .andExpect(status().isNoContent());

            verify(userSkillService).deleteUserSkill(skillId);
        }
    }

    @Nested
    @DisplayName("PUT /user-skills/{id}")
    class UpdateUserSkillTests {

        @Test
        void shouldReturn200WhenSkillIsUpdated() throws Exception {
            // given
            Integer skillId = 1;
            UserSkillRequestDto requestDto = new UserSkillRequestDto();
            requestDto.setDomainId(2);
            requestDto.setExpertiseLevelId(3);

            // when & then
            mockMvc.perform(put("/user-skills/{id}", skillId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestDto)))
                    .andExpect(status().isOk());
            
            // verify(userSkillService).updateUserSkill(eq(skillId), any(UserSkillRequestDto.class));
        }
    }
}