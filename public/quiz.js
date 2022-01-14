let done = false;
let question_index = 0;
let scores = [];

const collecting = true;
function score(amnt) {
    if (done) return;
    scores.push(amnt);
    serve_question();
}

function serve_question() {
    let q = questions[question_index++];
    document.getElementById("count").innerHTML = question_index + "/" + questions.length;

    if (!q) {
        done = true;
        const stats = calculate_psychometrics(scores);
        const analysis = psycometric_analysis(stats);
        const person = find_closest(stats);

        document.getElementById('prompt').innerHTML = ``;
        document.getElementById('question').parentElement.innerText = `You're most like ${person ?? 'No one.'}`;
        document.getElementById('other').innerHTML = `<h2>Breakdown</h2><br>${analysis.join('<br>')}`;
        document.getElementById("count").innerHTML = 'Done!';
        document.getElementById('answers').innerHTML = `<button onclick="copy_results()">Copy Score Data</button>`;
    }

    else document.getElementById('question').innerText = q;
}

function calculate_psychometrics(scores) {

    let g = (x) => {
        switch (scores[x]) {
            case -3: return 1;
            case -2: return 2;
            case -1: return 2.5;
            case 0: return 3;
            case 1: return 3.5;
            case 2: return 4;
            case 3: return 5;
            default:
                console.log(`Invalid score ${scores} [${x}]`);
                return 0;
        }
    };

    return {
        extroversion: Math.round(20 + g(0) - g(5) + g(10) - g(15) + g(20) - g(25) + g(30) - g(35) + g(40) - g(45)),
        agreeableness: Math.round(14 - g(1) + g(6) - g(11) + g(16) - g(21) + g(26) - g(31) + g(36) + g(41) + g(46)),
        consientiousness: Math.round(14 + g(2) - g(7) + g(12) - g(17) + g(22) - g(27) + g(32) - g(37) + g(42) + g(47)),
        neuroticism: Math.round(38 - g(3) + g(8) - g(13) + g(18) - g(23) - g(28) - g(33) - g(38) - g(43) - g(48)),
        openness: Math.round(8 + g(4) - g(9) + g(14) - g(19) + g(24) - g(29) + g(34) + g(39) + g(44) + g(49)),
    }
}

function psycometric_analysis(scores) {

    let description = [];

    //Extroversion
    {

        if (scores['extroversion'] > 30) {
            // Extremely extroverted
            description.push(
                'You are extremely extroverted. ' +
                'You primarily gain energy or gratification from external stimuli. ' +
                'Extroverted folk tend to be more enthusiastic, talkative and assertive. ' +
                'You are more likely to enjoy large social gatherings and are likely to work well in groups.'
            );
        }

        else if (scores['extroversion'] > 20) {
            // Moderaterly extroverted
            description.push(
                'You are moderately extroverted. ' +
                'You gain energy or gratification from external stimuli. ' +
                'Extroverted folk tend to be more enthusiastic, talkative and assertive. ' +
                'You are more likely to enjoy social gatherings and are more likely to work well in groups.'
            );
        }

        else if (scores['extroversion'] > 10) {
            // Moderately introverted
            description.push(
                'You are moderately introverted. ' +
                'You gain energy through reflection and internal experience. ' +
                'Introverted folk tend to enjoy time alone, or in less stimulating enviroments. ' +
                'You are more likely to observe events before joining them, and solitary activities may be more your speed.'
            );
        }

        else {
            // Extremely introverted
            description.push(
                'You are extremely introverted. ' +
                'You primarily gain energy through reflection and internal experience. ' +
                'Introverted folk tend to enjoy time alone, or in less stimulating enviroments. ' +
                'You are likely to observe events before joining them, and solitary activities are more your speed.'
            );
        }

    }

    description.push('');

    //Agreeableness
    {
        if (scores['agreeableness'] > 30) {
            // Extremely agreeable
            description.push(
                'You are extremely agreeable. ' +
                'You are empathetic and consider other\'s feelings before making decisions. ' +
                'You are perceived as a calm, warm, caring person, and are probably the source of social harmony in your friend groups.'
            );
        }

        else if (scores['agreeableness'] > 20) {
            // Moderately agreeable
            description.push(
                'You are moderately agreeable. ' +
                'You are somewhat empathetic and consider other\'s feelings before making big decisions. ' +
                'You are perceived as a calm, caring person, and you are probably the mediator of your friend groups.'
            );
        }

        else if (scores['agreeableness'] > 10) {
            // Moderately disagreeable
            description.push(
                'You are moderately disagreeable. ' +
                'You are less empathetic, and tend to think of yourself first. ',
                'You are somewhat manipulative and compete with others, and so others don\'t find you particularly trustworthy'
            );
        }

        else {
            // Extremely disagreeable
            description.push(
                'You are extremely disagreeable. ' +
                'You aren\'t empathetic, and think of yourself before others. ',
                'You are manipulative, taking advantage of and competing with others. Others find it hard to trust you.'
            )
        }
    }

    description.push('');

    // Conscientiousness
    {
        if (scores['conscientiousness'] > 30) {
            // Extremely conscientious
            description.push(
                'You are extremely conscientious. ' +
                'You are highly organized and tend to stick to a routine. ' +
                'You are likely to be a reliable worker, and are likely to be a good leader.'
            );
        }

        else if (scores['conscientiousness'] > 20) {
            // Moderately conscientious
            description.push(
                'You are moderately conscientious. ' +
                'You are organized and tend to stick to a routine. ' +
                'You are likely to be a reliable worker, and are likely to be a good leader.'
            );
        }

        else if (scores['conscientiousness'] > 10) {
            // Moderately disorganized
            description.push(
                'You are moderately disorganized. ' +
                'You\'re thoughts and workspaces are less organized, and your actions are somewhat impulsive. ' +
                'You are likely to be a reliable worker, and a good leader.'
            );
        }

        else {
            // Extremely disorganized
            description.push(
                'You are extremely disorganized. ' +
                'You\'re mind and workspaces are a chaotic mess, and you tend to be spontaneous. ' +
                'You are a reliable worker, a good leader and someone others look up to.'
            );
        }
    }

    description.push('');

    // Neuroticism
    {
        if (scores['neuroticism'] > 30) {
            // Extremely neurotic
            description.push(
                'You are extremely neurotic. ' +
                'Nurotic folk tend to be controlled by emotion, and are likely to experience anxiety, anger, jealosy and frustration in higher proportions. ',
                'You are likely to have poor self-control and an inability to control your emotions alongside difficulty managing stress. '
            );
        }

        else if (scores['neuroticism'] > 20) {
            // Moderately neurotic
            description.push(
                'You are moderately neurotic. ' +
                'Nurotic folk tend to be controlled by emotion, and are likely to experience anxiety, anger, jealosy and frustration in higher proportions. ',
                'You more likely to have limited control of yourself and actions and stress is difficult to manage. '
            );
        }

        else if (scores['neuroticism'] > 10) {
            // Moderately confident
            description.push(
                'You are moderately confident. ' +
                'You have good control over yourself and your emotions and can manage stressors moderately. ' +
                'Whilst feeling less lows, you might not feel as high emotional highs. '
            );
        }

        else {
            // Extremely confident
            description.push(
                'You are extremely confident. ' +
                'You have fine control over yourself and your emotions and can manage stressors well.' +
                'Your feel more self confidence, and your emotional lows are less pronounced. '
            );
        }
    }

    description.push('');

    // Openness
    {
        if (scores['openness'] > 30) {
            // Extremely open
            description.push(
                'You are extremely open. ' +
                'You are open to, and exited for new ideas and new experiences. ' +
                'You are likely to be more interested in your present than the future.'
            );
        }

        else if (scores['openness'] > 20) {
            // Moderately open
            description.push(
                'You are moderately open. ' +
                'You are open to new ideas and experiences. ' +
                'You are likely to be more interested in the present than the future.'
            );
        }

        else if (scores['openness'] > 10) {
            // Moderately closed
            description.push(
                'You are moderately closed off. ' +
                'You are less open to new ideas and new experiences, opting for things you\'re used to. ' +
                'You are likely to be more interested in the future than the present. '
            );
        }

        else {
            // Extremely closed
            description.push(
                'You are extremely closed off. ' +
                'You enjoy the safety in things you\'ve done before, being unlikely to try new things. ' +
                'You are likely to be more interested in your future than the present.'
            );
        }
    }

    return description;

}

function find_closest() {

    return Object.entries(people)
        .sort(([_, a], [__, b]) => person_diff(a) - person_diff(b))[0][0];

}

function person_diff(person) {

    return person.reduce((acc, v, i) => acc + Math.abs(scores[i] - v), 0);

}

function copy_results() {
    
    navigator.clipboard.writeText(JSON.stringify(scores));
    
}

serve_question();
