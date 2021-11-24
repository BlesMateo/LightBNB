INSERT INTO users (id, name, email, password)
VALUES (1, 'Sterling Archer', 'dutchess@isis.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Lana Kane', 'she-hulk@isis.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Mallory Archer', 'absinthe@isis.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties(id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active )
VALUES (1, 3, 'Office', 'Spy Agency', 'img/office_thumb.png', 'img/office.png', 800, 20, 10, 4, 'United States', 'New York Street', 'New York', 'New York', 'askdjalks', TRUE),
(2, 3, 'Apartment', 'High end dwelling', 'img/apartment_thumb.png', 'img/apartment.png', 1000, 2, 2, 2, 'Canada', 'Truckasaurus Street', 'Ottawa', 'Ontario', 'askdjalks', TRUE),
(3, 3, 'Penthouse', 'Affluent Living Space', 'img/penthouse_thumb.png', 'img/penthouse.png', 3000, 5, 5, 5, 'Tunisia', 'Martini Street', 'Bourbon', 'Ben Arous', 'askdjalks', TRUE);

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 3, '2018-10-14', '2018-11-27'),
(2, 2, '2020-04-19', '2019-05-09'),
(3, 1, '2021-09-23', '2021-11-18');

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating)
VALUES (1, 1, 1, 1, 1),
(2, 2, 2, 2, 4),
(3, 3, 3, 3, 5);