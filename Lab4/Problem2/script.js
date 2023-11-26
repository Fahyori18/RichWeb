document.addEventListener("DOMContentLoaded", function () {
    // Import functions and operators from RxJS
    const { fromEvent, timer } = rxjs;
    const { map, takeUntil } = rxjs.operators;

    // Function to calculate total seconds based on user input
    function calculateTotalSeconds(hours, minutes, seconds) {
        return (parseInt(hours) || 0) * 3600 +
               (parseInt(minutes) || 0) * 60 +
               (parseInt(seconds) || 0);
    }

    // Function to update the timer output
    function updateTimerOutput(remainingSeconds) {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        timerOutput.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // HTML Elements
    const hoursInput = document.getElementById("counter-hours");
    const minutesInput = document.getElementById("counter-minutes");
    const secondsInput = document.getElementById("counter-seconds");
    const startButton = document.getElementById("counter-startButton");
    const timerOutput = document.getElementById("counter-timerOutput");

    // Observable for the click event on the start button
    const startButtonClick$ = fromEvent(startButton, 'click');

    // Subscribe to start button click event
    startButtonClick$.subscribe(() => {
        // Calculate total seconds based on user input
        const totalSeconds = calculateTotalSeconds(hoursInput.value, minutesInput.value, secondsInput.value);

        // Check if the input is valid
        if (totalSeconds <= 0 || isNaN(totalSeconds)) {
            alert("Please enter a valid time.");
            return;
        }

        // Create a countdown observable
        const countdown$ = timer(0, 1000).pipe(
            map((time) => totalSeconds - time),
            takeUntil(timer((totalSeconds + 1) * 1000))
        );

        // Subscribe to the countdown observable
        countdown$.subscribe(updateTimerOutput);
    });
});
