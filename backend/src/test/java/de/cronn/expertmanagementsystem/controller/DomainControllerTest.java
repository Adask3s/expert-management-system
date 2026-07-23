package de.cronn.expertmanagementsystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.mapper.DomainMapper;
import de.cronn.expertmanagementsystem.model.DomainDto;
import de.cronn.expertmanagementsystem.model.DomainRequestDto;
import de.cronn.expertmanagementsystem.service.DomainService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class DomainControllerTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private DomainService domainService;

    @Mock
    private DomainMapper domainMapper;

    @InjectMocks
    private DomainController domainController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(domainController).build();
    }

    @Test
    void shouldReturnAllDomainsWithStatus200() throws Exception {
        Domain domain = new Domain();
        domain.setId(1L);
        domain.setName("Backend");

        DomainDto domainDto = new DomainDto();
        domainDto.setId(1);
        domainDto.setName("Backend");

        when(domainService.getAllDomains()).thenReturn(List.of(domain));
        when(domainMapper.toDto(domain)).thenReturn(domainDto);

        mockMvc.perform(get("/domains")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].name").value("Backend"));
    }

    @Test
    void shouldCreateDomainWithStatus201() throws Exception {
        DomainRequestDto requestDto = new DomainRequestDto();
        requestDto.setName("DevOps");

        Domain mappedEntity = new Domain();
        Domain savedEntity = new Domain();
        savedEntity.setId(5L);

        DomainDto responseDto = new DomainDto();
        responseDto.setId(5);
        responseDto.setName("DevOps");

        when(domainMapper.toEntity(any(DomainRequestDto.class))).thenReturn(mappedEntity);
        when(domainService.createDomain(mappedEntity)).thenReturn(savedEntity);
        when(domainMapper.toDto(savedEntity)).thenReturn(responseDto);

        mockMvc.perform(post("/domains")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated()) // Kod 201
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.name").value("DevOps"));
    }

    @Test
    void shouldUpdateDomainWithStatus200() throws Exception {
        Long idToUpdate = 1L;
        DomainRequestDto requestDto = new DomainRequestDto();
        requestDto.setName("Nowa Nazwa");

        Domain mappedEntity = new Domain();
        Domain updatedEntity = new Domain();

        DomainDto responseDto = new DomainDto();
        responseDto.setId(1);
        responseDto.setName("Nowa Nazwa");

        when(domainMapper.toEntity(any(DomainRequestDto.class))).thenReturn(mappedEntity);
        when(domainService.updateDomain(eq(idToUpdate), any(Domain.class))).thenReturn(updatedEntity);
        when(domainMapper.toDto(updatedEntity)).thenReturn(responseDto);

        mockMvc.perform(put("/domains/{id}", idToUpdate)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nowa Nazwa"));
    }

    @Test
    void shouldDeleteDomainWithStatus204() throws Exception {
        Long idToDelete = 3L;

        mockMvc.perform(delete("/domains/{id}", idToDelete))
                .andExpect(status().isNoContent()); // Kod 204
        verify(domainService, times(1)).deleteDomain(idToDelete);
    }
}