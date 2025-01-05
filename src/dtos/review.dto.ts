export interface CreateReviewDTO {
    userId: any;
    eventId: any;
    rating: number;   // Rating harus berupa angka
    comment: string;  // Komentar harus berupa string
  }
  