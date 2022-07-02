import config from "config";

export function getSessionToken() {
  return sessionStorage.getItem("dpSessionToken")
}

export async function getAverages() {
  const response = await fetch(config.apiUrl + "/dp/averages");

  if (!response.ok) {
    console.error("Couldn't get averages: " + error);
    return null;
  }

  const data = await response.json();

  if (data[0].price__avg == null) {
    console.error("No averages: " + data);
  } else {
    return data;
  }
}

export async function getPHOPriceHistory(name) {
  const response = await fetch(config.apiUrl + "/dp/history/pho?name=" + name);

  if (!response.ok) {
    console.error("Couldn't get averages: " + error);
    return null;
  }

  const data = await response.json();
  return data;
}

export async function getPriceHistory() {
  const response = await fetch(config.apiUrl + "/dp/history");

  if (!response.ok) {
    console.error("Couldn't get averages: " + error);
    return null;
  }

  const data = await response.json();
  return data;
}

export async function getPHOAverages(name) {
  const response = await fetch(config.apiUrl + "/dp/averages/pho?name=" + name);
  const data = await response.json();

  if (!response.ok) {
    console.error("Couldn't get averages: " + error);
    return null;
  }

  if (data[0].price__avg == null) {
    console.error("No averages: " + data);
  } else {
    return data;
  }
}

export async function getPhoList() {
  const response = await fetch(config.apiUrl + "/dp/api/pho/");

  if (!response.ok) {
    console.error(response);
    return null;
  }

  const data = await response.json();
  return data;
}

export async function getLogsList(name) {
  const response = await fetch(config.apiUrl + "/dp/api/logs/?source=" + name);

  if (!response.ok) {
    console.error(response);
    return null;
  }

  const data = await response.json();
  return data;
}

export async function stopScraping(task_id, module) {
  const response = await fetch(
    config.apiUrl + "/dp/task_status?task_id=" + task_id + "&module=" + module,
    {
      method: "DELETE",
      headers: {
        Authorization: "Token " + getSessionToken(),
      },
    }
  );

  if (!response.ok) {
    console.error(response);
    return null;
  }

  const data = await response.json();
  return data;
}

export async function startScraping(module) {
  const response = await fetch(config.apiUrl + "/dp/scrape/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getSessionToken(),
    },
    body: JSON.stringify({ module }),
  });

  if (!response.ok) {
    console.error(response);
    return { data: null, error: response };
  }

  const data = await response.json();

  return { data: data, error: null };
}

export async function submitData(module) {
  const response = await fetch(config.apiUrl + "/dp/submit/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getSessionToken(),
    },
    body: JSON.stringify({ module: module }),
  });

  if (!response.ok) {
    console.error(response);
    return { data: null, error: response };
  }

  const data = await response.json();

  return { data: data, error: null };
}

export async function checkTask(task_id) {
  const response = await fetch(
    config.apiUrl + "/dp/task_status?task_id=" + task_id
  );

  if (!response.ok) {
    console.error(response);
    return { data: null, error: response };
  }

  const data = await response.json();

  return { data: data, error: null };
}
