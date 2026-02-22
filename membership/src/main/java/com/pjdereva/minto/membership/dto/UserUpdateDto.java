package com.pjdereva.minto.membership.dto;

public record UserUpdateDto(
        String firstName,
        String lastName,
        String email,
        String password,
        String role,
        String imageName,
        String imageType,
        byte[] imageData
) {

}
