function calculateCompatibility(p1, p2) {
    let score = 0;

    // Same hostel_block: +10
    if (p1.hostel_block === p2.hostel_block) {
        score += 10;
    }

    // Same sleep_time: +15
    if (p1.sleep_time === p2.sleep_time) {
        score += 15;
    }

    // Same study_habit: +15
    if (p1.study_habit === p2.study_habit) {
        score += 15;
    }

    // Same cleanliness: +10
    if (p1.cleanliness === p2.cleanliness) {
        score += 10;
    }

    // Smoking compatibility: complex logic for new options
    if (p1.smoking === p2.smoking) {
        score += 10; // Same preference
    } else if ((p1.smoking === 'must_not' && (p2.smoking === 'daily' || p2.smoking === 'social')) ||
               (p2.smoking === 'must_not' && (p1.smoking === 'daily' || p1.smoking === 'social'))) {
        score -= 50; // Strong conflict
    } else if ((p1.smoking === 'no' && (p2.smoking === 'daily' || p2.smoking === 'social')) ||
               (p2.smoking === 'no' && (p1.smoking === 'daily' || p1.smoking === 'social'))) {
        score -= 30; // Moderate conflict
    }

    // Guest frequency match: +10
    if (p1.guest_freq === p2.guest_freq) {
        score += 10;
    }

    // Atheism preference match: +5
    if (p1.atheism && p2.atheism && p1.atheism === p2.atheism) {
        score += 5;
    }

    // Same habits: +5
    if (p1.habits === p2.habits) {
        score += 5;
    }

    // Same state: +5
    if (p1.state === p2.state) {
        score += 5;
    }

    // Vegetarian preference compatibility
    if (p1.vegetarian && p2.vegetarian) {
        if (p1.vegetarian === p2.vegetarian) {
            score += 8; // Same preference
        } else if ((p1.vegetarian === 'vegan' && p2.vegetarian === 'vegetarian') ||
                   (p2.vegetarian === 'vegan' && p1.vegetarian === 'vegetarian')) {
            score += 5; // Vegan-vegetarian compatibility
        } else if (p1.vegetarian === 'no_preference' || p2.vegetarian === 'no_preference') {
            score += 3; // Neutral preference
        }
    }

    // Introvert/Extrovert compatibility
    if (p1.introvert && p2.introvert) {
        if (p1.introvert === p2.introvert) {
            score += 8; // Same personality type
        } else if ((p1.introvert === 'ambivert') || (p2.introvert === 'ambivert')) {
            score += 5; // Ambiverts are flexible
        } else if ((p1.introvert === 'shy_introvert' && p2.introvert === 'introvert') ||
                   (p2.introvert === 'shy_introvert' && p1.introvert === 'introvert')) {
            score += 4; // Similar introvert types
        }
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    return score;
}

module.exports = { calculateCompatibility };