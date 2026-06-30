export async function EredivisieTeams() {
    try {
        const response = await fetch('http://145.24.237.133:8001/teams', {
            headers: {
                Accept: 'application/json'
            }
        });
        const data = await response.json();

        return data.items;
    } catch (error) {
        console.error(error);
        return [];
    }
}