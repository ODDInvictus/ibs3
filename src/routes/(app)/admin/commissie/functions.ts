import { toast } from '$lib/notification';
import { confirm } from '$lib/confirm';
import { prompt } from '$lib/prompt';
import { promptSelect } from '$lib/promptSelect';

async function cb(body: object, method: string, onSuccess: string) {
  await fetch('', {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(async (res) => {
    if (res.status === 200) {
      toast({
        title: 'Succes',
        message: onSuccess,
        type: 'success'
      });
      setTimeout(() => location.reload(), 1000);
    } else {
      const json = await res.json()
      toast({
        title: 'Oei!',
        message: json.message,
        type: 'error'
      });
    }
  });
}

export function addMember(users: any[], id: number, committee: string) {
  promptSelect({
    title: `Lid toevoegen aan ${committee}`,
    message: 'Selecteer een lid',
    options: users.map((member) => ({
      key:
        `${member.firstName} ${member.lastName}` +
        (member.nickname ? ` (${member.nickname})` : ''),
      value: member.id
    })),
    cb: async (selection) => {
      if (selection) await cb({ id, userId: selection }, 'POST', 'Het lid is succesvol toegevoegd');
    }
  });
}

export function removeMember(id: number, name: string, committee: string) {
  confirm({
    title: 'Weet je het zeker?',
    message: `Weet je zeker dat je ${name} wilt verwijderen uit de ${committee}?`,
    cb: async (success) => {
      if (success) await cb({ id, type: 'member' }, 'DELETE', 'Het lid is succesvol verwijderd');
    }
  });
}

export function renameCommittee(id: number, oldName: string) {
  prompt({
    title: `${oldName} hernoemen`,
    message: 'Voer de nieuwe naam in',
    cb: async (newName) => {
      if (newName) await cb({ id, newName }, 'PUT', 'De commissie is succesvol hernoemd');
    }
  });
}

export function deleteCommittee(id: number) {
  confirm({
    title: 'Weet je het zeker?',
    message: 'Als je de commissie verwijdert zal de email nog maximaal 24 uur blijven werken. De commissie is wel al gelijk verwijderd',
    cb: async (success) => {
      if (success) await cb({ id, type: 'committee' }, 'DELETE', 'De commissie is succesvol verwijderd');
    }
  });
}