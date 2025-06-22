# Booking Service Proto Definition

## 1. Introduction

This document details the Protocol Buffer (Protobuf) definition for the `BookingService`, which manages core booking operations within the Bus Ticket Booking System. This service is a critical component for creating, retrieving, updating, and canceling bus ticket reservations.

## 2. Proto File Location

The official `.proto` file for this service is located at:
`[api-contracts-repo-link]/proto/com/example/bookings/v1/booking_service.proto`

## 3. Service Definition (`BookingService`)

```protobuf
syntax = "proto3";

package com.example.bookings.v1;

import "google/protobuf/timestamp.proto";
import "google/protobuf/duration.proto";
import "com/example/common/v1/common_types.proto"; // Assuming common types are defined elsewhere

service BookingService {
  // Creates a new bus ticket booking.
  rpc CreateBooking(CreateBookingRequest) returns (CreateBookingResponse) {
    option (google.api.http) = {
      post: "/v1/bookings"
      body: "*"
    };
  }

  // Retrieves booking details by ID.
  rpc GetBooking(GetBookingRequest) returns (GetBookingResponse);

  // Updates an existing booking (e.g., change seat, add passenger).
  rpc UpdateBooking(UpdateBookingRequest) returns (UpdateBookingResponse);

  // Cancels a booking.
  rpc CancelBooking(CancelBookingRequest) returns (CancelBookingResponse);

  // Confirms a payment for a pending booking.
  rpc ConfirmPayment(ConfirmPaymentRequest) returns (ConfirmPaymentResponse);
}