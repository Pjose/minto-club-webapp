package com.pjdereva.minto.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String source;
    private String imageName;
    private String imageType;
    private byte[] imageData;
    private String createdAt;
    private String updatedAt;
}
