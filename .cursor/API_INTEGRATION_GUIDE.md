# Руководство по интеграции API с TanStack Query

## Установка зависимостей

```bash
npm install @tanstack/react-query
```

## 1. Настройка QueryClient

**src/app/App.tsx:**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* ... routes */}
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

## 2. API клиент

**src/shared/api/client.ts:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
};
```

## 3. Queries и Mutations

### Рекрутеры

**src/entities/recruiter/api/recruiterApi.ts:**
```typescript
import { apiClient } from '../../../shared/api/client';
import type { Recruiter } from '../../../shared/types';

export const recruiterApi = {
  getAll: () => apiClient.get<Recruiter[]>('/recruiters'),
  getById: (id: string) => apiClient.get<Recruiter>(`/recruiters/${id}`),
  create: (data: Omit<Recruiter, 'id' | 'companiesCount'>) => 
    apiClient.post<Recruiter>('/recruiters', data),
  update: (id: string, data: Partial<Recruiter>) => 
    apiClient.put<Recruiter>(`/recruiters/${id}`, data),
  delete: (id: string) => apiClient.delete(`/recruiters/${id}`),
};
```

**src/entities/recruiter/model/useRecruiters.ts:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recruiterApi } from '../api/recruiterApi';
import { notifications } from '@mantine/notifications';

export const RECRUITERS_QUERY_KEY = ['recruiters'];

export const useRecruiters = () => {
  return useQuery({
    queryKey: RECRUITERS_QUERY_KEY,
    queryFn: recruiterApi.getAll,
  });
};

export const useRecruiter = (id: string) => {
  return useQuery({
    queryKey: [...RECRUITERS_QUERY_KEY, id],
    queryFn: () => recruiterApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateRecruiter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recruiterApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECRUITERS_QUERY_KEY });
      notifications.show({
        title: 'Успешно',
        message: 'Рекрутер создан',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message || 'Не удалось создать рекрутера',
        color: 'red',
      });
    },
  });
};

export const useUpdateRecruiter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Recruiter> }) =>
      recruiterApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECRUITERS_QUERY_KEY });
      notifications.show({
        title: 'Успешно',
        message: 'Рекрутер обновлен',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message || 'Не удалось обновить рекрутера',
        color: 'red',
      });
    },
  });
};
```

### Вакансии

**src/entities/vacancy/api/vacancyApi.ts:**
```typescript
import { apiClient } from '../../../shared/api/client';
import type { Vacancy } from '../../../shared/types';

export const vacancyApi = {
  getAll: () => apiClient.get<Vacancy[]>('/vacancies'),
  getByCompany: (companyId: string) => 
    apiClient.get<Vacancy[]>(`/vacancies?companyId=${companyId}`),
  getById: (id: string) => apiClient.get<Vacancy>(`/vacancies/${id}`),
  create: (data: Omit<Vacancy, 'id' | 'createdAt'>) => 
    apiClient.post<Vacancy>('/vacancies', data),
  update: (id: string, data: Partial<Vacancy>) => 
    apiClient.put<Vacancy>(`/vacancies/${id}`, data),
  delete: (id: string) => apiClient.delete(`/vacancies/${id}`),
};
```

**src/entities/vacancy/model/useVacancies.ts:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vacancyApi } from '../api/vacancyApi';
import { notifications } from '@mantine/notifications';

export const VACANCIES_QUERY_KEY = ['vacancies'];

export const useVacancies = () => {
  return useQuery({
    queryKey: VACANCIES_QUERY_KEY,
    queryFn: vacancyApi.getAll,
  });
};

export const useVacanciesByCompany = (companyId: string) => {
  return useQuery({
    queryKey: [...VACANCIES_QUERY_KEY, 'company', companyId],
    queryFn: () => vacancyApi.getByCompany(companyId),
    enabled: !!companyId,
  });
};

export const useCreateVacancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vacancyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VACANCIES_QUERY_KEY });
      notifications.show({
        title: 'Успешно',
        message: 'Вакансия создана',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message || 'Не удалось создать вакансию',
        color: 'red',
      });
    },
  });
};

export const useUpdateVacancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vacancy> }) =>
      vacancyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VACANCIES_QUERY_KEY });
      notifications.show({
        title: 'Успешно',
        message: 'Вакансия обновлена',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message || 'Не удалось обновить вакансию',
        color: 'red',
      });
    },
  });
};
```

## 4. Использование в компонентах

### CreateRecruiterDrawer

**src/features/create-recruiter/ui/CreateRecruiterDrawer.tsx:**
```typescript
import { useCreateRecruiter } from '../../../entities/recruiter/model/useRecruiters';

export const CreateRecruiterDrawer = ({ opened, onClose }: Props) => {
  const { mutate, isPending } = useCreateRecruiter();
  
  const handleSubmit = (values: RecruiterFormValues) => {
    mutate(values, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    // ... form
    <Button type="submit" loading={isPending}>
      Создать
    </Button>
  );
};
```

### RecruitersPage

**src/pages/recruiters/ui/RecruitersPage.tsx:**
```typescript
import { useRecruiters } from '../../../entities/recruiter/model/useRecruiters';

export const RecruitersPage = () => {
  const { data: recruiters = [], isLoading, error } = useRecruiters();
  
  if (isLoading) return <Loader />;
  if (error) return <Text>Ошибка загрузки</Text>;

  const filteredRecruiters = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return recruiters.filter(/* ... */);
  }, [recruiters, searchQuery]);

  // ...
};
```

## 5. Environment Variables

Создайте файл `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

## Следующие шаги

1. Установите `@tanstack/react-query`
2. Создайте API клиент
3. Создайте hooks для каждой сущности
4. Замените моковые данные на вызовы API
5. Добавьте обработку loading и error состояний
6. Настройте переменные окружения
